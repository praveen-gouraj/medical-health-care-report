import PyPDF2
import pdfplumber
import re
from typing import Dict, List, Tuple, Optional
import logging

class PDFProcessor:
    """Handles extraction of text from medical report PDFs"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def extract_text_pypdf2(self, pdf_path: str) -> str:
        """Extract text from PDF using PyPDF2"""
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            self.logger.error(f"Error extracting text with PyPDF2: {e}")
            return ""
    
    def extract_text_pdfplumber(self, pdf_path: str) -> str:
        """Extract text from PDF using pdfplumber (better for tables)"""
        try:
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
            return text
        except Exception as e:
            self.logger.error(f"Error extracting text with pdfplumber: {e}")
            return ""
    
    def extract_text(self, pdf_path: str, method: str = "pdfplumber") -> str:
        """Extract text from PDF using specified method"""
        if method == "pypdf2":
            return self.extract_text_pypdf2(pdf_path)
        else:
            return self.extract_text_pdfplumber(pdf_path)
    
    def extract_test_values(self, text: str) -> Dict[str, Dict]:
        """Extract test names and values from medical report text"""
        test_results = {}
        
        # Common patterns for medical test results
        patterns = [
            # Pattern 1: Test Name: Value Unit (Range)
            r'([A-Za-z\s\(\)]+):\s*([0-9\.]+)\s*([A-Za-z/%]+)?\s*\(?([0-9\.\-\s]+)?\)?',
            # Pattern 2: Test Name   Value   Unit   Range
            r'([A-Za-z\s\(\)]+)\s+([0-9\.]+)\s+([A-Za-z/%]+)?\s+([0-9\.\-\s]+)',
            # Pattern 3: Test Name = Value Unit
            r'([A-Za-z\s\(\)]+)\s*=\s*([0-9\.]+)\s*([A-Za-z/%]+)?'
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                test_name = match.group(1).strip()
                value = float(match.group(2))
                unit = match.group(3) if len(match.groups()) > 2 and match.group(3) else ""
                reference_range = match.group(4) if len(match.groups()) > 3 and match.group(4) else ""
                
                # Clean up test name
                test_name = re.sub(r'\s+', ' ', test_name).strip()
                
                # Skip if test name is too short or contains only numbers
                if len(test_name) < 3 or test_name.isdigit():
                    continue
                
                test_results[test_name] = {
                    'value': value,
                    'unit': unit.strip() if unit else "",
                    'reference_range': reference_range.strip() if reference_range else "",
                    'raw_text': match.group(0)
                }
        
        return test_results
    
    def extract_tables_from_pdf(self, pdf_path: str) -> List[List[List[str]]]:
        """Extract tables from PDF using pdfplumber"""
        tables = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_tables = page.extract_tables()
                    if page_tables:
                        tables.extend(page_tables)
        except Exception as e:
            self.logger.error(f"Error extracting tables: {e}")
        
        return tables
    
    def process_medical_report(self, pdf_path: str) -> Dict:
        """Process a medical report PDF and extract structured data"""
        # Extract text
        text = self.extract_text(pdf_path)
        
        # Extract test values
        test_values = self.extract_test_values(text)
        
        # Extract tables for better structured data
        tables = self.extract_tables_from_pdf(pdf_path)
        
        # Try to extract additional structured data from tables
        table_test_values = self.extract_values_from_tables(tables)
        
        # Merge results
        all_test_values = {**test_values, **table_test_values}
        
        return {
            'raw_text': text,
            'test_values': all_test_values,
            'tables': tables
        }
    
    def extract_values_from_tables(self, tables: List[List[List[str]]]) -> Dict[str, Dict]:
        """Extract test values from table structures"""
        test_results = {}
        
        for table in tables:
            if not table or len(table) < 2:
                continue
            
            # Look for common table headers
            headers = [cell.lower() if cell else "" for cell in table[0]]
            
            # Find column indices
            test_col = -1
            value_col = -1
            unit_col = -1
            range_col = -1
            
            for i, header in enumerate(headers):
                if any(keyword in header for keyword in ['test', 'parameter', 'name']):
                    test_col = i
                elif any(keyword in header for keyword in ['value', 'result']):
                    value_col = i
                elif any(keyword in header for keyword in ['unit', 'units']):
                    unit_col = i
                elif any(keyword in header for keyword in ['range', 'reference', 'normal']):
                    range_col = i
            
            # Extract data rows
            if test_col >= 0 and value_col >= 0:
                for row in table[1:]:
                    if len(row) > max(test_col, value_col):
                        test_name = row[test_col] if row[test_col] else ""
                        value_str = row[value_col] if row[value_col] else ""
                        
                        # Try to extract numeric value
                        numeric_match = re.search(r'([0-9\.]+)', str(value_str))
                        if numeric_match and test_name:
                            value = float(numeric_match.group(1))
                            unit = row[unit_col] if unit_col >= 0 and len(row) > unit_col else ""
                            ref_range = row[range_col] if range_col >= 0 and len(row) > range_col else ""
                            
                            test_results[test_name.strip()] = {
                                'value': value,
                                'unit': unit.strip() if unit else "",
                                'reference_range': ref_range.strip() if ref_range else "",
                                'raw_text': f"{test_name}: {value_str}"
                            }
        
        return test_results