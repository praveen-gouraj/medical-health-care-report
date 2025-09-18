import json
import os
import re
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime

class MedicalAnalyzer:
    """AI-powered analysis engine for medical test results"""
    
    def __init__(self, knowledge_base_path: str = None):
        self.logger = logging.getLogger(__name__)
        
        # Load medical knowledge base
        if knowledge_base_path is None:
            knowledge_base_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'medical_knowledge_base.json')
        
        try:
            with open(knowledge_base_path, 'r') as f:
                self.knowledge_base = json.load(f)
            self.logger.info("Medical knowledge base loaded successfully")
        except FileNotFoundError:
            self.logger.error(f"Knowledge base not found at {knowledge_base_path}")
            self.knowledge_base = {"test_parameters": {}, "severity_levels": {}, "disclaimers": []}
        except json.JSONDecodeError:
            self.logger.error("Invalid JSON in knowledge base")
            self.knowledge_base = {"test_parameters": {}, "severity_levels": {}, "disclaimers": []}
    
    def find_test_parameter(self, test_name: str) -> Optional[Dict]:
        """Find test parameter in knowledge base by name or alias"""
        test_name_lower = test_name.lower().strip()
        
        # Direct match
        for param_name, param_data in self.knowledge_base['test_parameters'].items():
            if param_name.lower() == test_name_lower:
                return param_data
        
        # Alias match
        for param_name, param_data in self.knowledge_base['test_parameters'].items():
            if 'aliases' in param_data:
                for alias in param_data['aliases']:
                    if alias.lower() == test_name_lower:
                        return param_data
        
        # Partial match
        for param_name, param_data in self.knowledge_base['test_parameters'].items():
            if test_name_lower in param_name.lower() or param_name.lower() in test_name_lower:
                return param_data
        
        return None
    
    def determine_status(self, value: float, normal_range: Dict, gender: str = "general") -> str:
        """Determine if a test value is normal, low, or high"""
        
        # Try gender-specific range first, then fall back to general
        range_data = normal_range.get(gender, normal_range.get("general", {}))
        
        if not range_data or 'min' not in range_data or 'max' not in range_data:
            return "unknown"
        
        min_val = range_data['min']
        max_val = range_data['max']
        
        if value < min_val:
            return "low"
        elif value > max_val:
            return "high"
        else:
            return "normal"
    
    def analyze_single_test(self, test_name: str, value: float, gender: str = "general") -> Dict:
        """Analyze a single test result"""
        
        result = {
            'test_name': test_name,
            'value': value,
            'status': 'unknown',
            'explanation': '',
            'severity': 'low',
            'recommendations': '',
            'normal_range': '',
            'category': 'Unknown'
        }
        
        # Find test parameter in knowledge base
        param_data = self.find_test_parameter(test_name)
        
        if not param_data:
            result['explanation'] = f"Test '{test_name}' not found in our database. Please consult your doctor for interpretation."
            return result
        
        # Get normal range
        normal_ranges = param_data.get('normal_ranges', {})
        range_data = normal_ranges.get(gender, normal_ranges.get('general', {}))
        
        if range_data:
            result['normal_range'] = f"{range_data['min']}-{range_data['max']} {range_data.get('unit', '')}"
            result['status'] = self.determine_status(value, normal_ranges, gender)
        
        # Get category
        result['category'] = param_data.get('category', 'Unknown')
        
        # Generate explanation based on status
        if result['status'] in ['low', 'high'] and 'conditions' in param_data:
            condition_data = param_data['conditions'].get(result['status'], {})
            if condition_data:
                result['explanation'] = condition_data.get('explanation', '')
                result['severity'] = condition_data.get('severity', 'low')
                result['recommendations'] = condition_data.get('recommendations', '')
        elif result['status'] == 'normal':
            result['explanation'] = f"Your {test_name} level is within the normal range."
            result['severity'] = 'low'
        
        return result
    
    def analyze_test_results(self, test_results: Dict[str, Dict], gender: str = "general") -> Dict:
        """Analyze multiple test results and generate comprehensive report"""
        
        analyzed_results = []
        summary = {
            'total_tests': len(test_results),
            'normal_count': 0,
            'abnormal_count': 0,
            'high_severity_count': 0,
            'categories': set()
        }
        
        # Analyze each test
        for test_name, test_data in test_results.items():
            if 'value' not in test_data:
                continue
                
            analysis = self.analyze_single_test(test_name, test_data['value'], gender)
            
            # Add original test data
            analysis['unit'] = test_data.get('unit', '')
            analysis['reference_range'] = test_data.get('reference_range', '')
            analysis['raw_text'] = test_data.get('raw_text', '')
            
            analyzed_results.append(analysis)
            
            # Update summary
            summary['categories'].add(analysis['category'])
            if analysis['status'] == 'normal':
                summary['normal_count'] += 1
            else:
                summary['abnormal_count'] += 1
            
            if analysis['severity'] == 'high':
                summary['high_severity_count'] += 1
        
        # Convert set to list for JSON serialization
        summary['categories'] = list(summary['categories'])
        
        # Generate overall assessment
        overall_assessment = self.generate_overall_assessment(analyzed_results, summary)
        
        # Get disclaimers
        disclaimers = self.knowledge_base.get('disclaimers', [])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'analyzed_results': analyzed_results,
            'summary': summary,
            'overall_assessment': overall_assessment,
            'disclaimers': disclaimers,
            'severity_levels': self.knowledge_base.get('severity_levels', {})
        }
    
    def generate_overall_assessment(self, analyzed_results: List[Dict], summary: Dict) -> str:
        """Generate an overall assessment of the test results"""
        
        total_tests = summary['total_tests']
        normal_count = summary['normal_count']
        abnormal_count = summary['abnormal_count']
        high_severity_count = summary['high_severity_count']
        
        if total_tests == 0:
            return "No test results could be analyzed."
        
        assessment_parts = []
        
        # Overall status
        if abnormal_count == 0:
            assessment_parts.append("All your test results are within normal ranges. This is great news!")
        elif normal_count > abnormal_count:
            assessment_parts.append(f"Most of your test results ({normal_count} out of {total_tests}) are within normal ranges.")
        else:
            assessment_parts.append(f"Several of your test results ({abnormal_count} out of {total_tests}) are outside normal ranges.")
        
        # High priority items
        if high_severity_count > 0:
            high_priority_tests = [r['test_name'] for r in analyzed_results if r['severity'] == 'high']
            assessment_parts.append(f"⚠️ Important: {', '.join(high_priority_tests)} require immediate medical attention.")
        
        # Moderate priority items
        moderate_priority_tests = [r['test_name'] for r in analyzed_results if r['severity'] == 'moderate' and r['status'] != 'normal']
        if moderate_priority_tests:
            assessment_parts.append(f"Please discuss these results with your doctor: {', '.join(moderate_priority_tests)}")
        
        # Categories summary
        categories = summary['categories']
        if len(categories) > 1:
            assessment_parts.append(f"Your tests cover {len(categories)} areas: {', '.join(categories)}")
        
        return " ".join(assessment_parts)
    
    def generate_patient_friendly_explanation(self, test_name: str, value: float, analysis: Dict) -> str:
        """Generate a simple, patient-friendly explanation"""
        
        explanation_parts = []
        
        # Basic result
        status_emoji = {"normal": "✅", "low": "⬇️", "high": "⬆️", "unknown": "❓"}
        emoji = status_emoji.get(analysis['status'], "")
        
        explanation_parts.append(f"{emoji} {test_name}: {value} {analysis.get('unit', '')}")
        
        # Normal range context
        if analysis['normal_range']:
            explanation_parts.append(f"(Normal: {analysis['normal_range']})")
        
        # Simple explanation
        if analysis['explanation']:
            explanation_parts.append(f"\n{analysis['explanation']}")
        
        return " ".join(explanation_parts)
    
    def smart_text_analysis(self, raw_text: str) -> Dict:
        """Perform intelligent analysis of medical report text using NLP techniques"""
        
        # Extract patient information
        patient_info = self.extract_patient_info(raw_text)
        
        # Extract test dates
        test_dates = self.extract_test_dates(raw_text)
        
        # Look for doctor's comments or interpretations
        doctor_comments = self.extract_doctor_comments(raw_text)
        
        # Identify test categories
        test_categories = self.identify_test_categories(raw_text)
        
        return {
            'patient_info': patient_info,
            'test_dates': test_dates,
            'doctor_comments': doctor_comments,
            'test_categories': test_categories
        }
    
    def extract_patient_info(self, text: str) -> Dict:
        """Extract basic patient information from report text"""
        patient_info = {}
        
        # Look for name patterns
        name_patterns = [
            r'Patient[:\s]+([A-Za-z\s]+)',
            r'Name[:\s]+([A-Za-z\s]+)',
            r'Patient Name[:\s]+([A-Za-z\s]+)'
        ]
        
        for pattern in name_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                patient_info['name'] = match.group(1).strip()
                break
        
        # Look for age patterns
        age_patterns = [
            r'Age[:\s]+(\d+)',
            r'(\d+)\s*years?\s*old',
            r'Age\s*:\s*(\d+)'
        ]
        
        for pattern in age_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                patient_info['age'] = int(match.group(1))
                break
        
        # Look for gender patterns
        gender_patterns = [
            r'Sex[:\s]+(M|F|Male|Female)',
            r'Gender[:\s]+(M|F|Male|Female)',
            r'\b(Male|Female)\b'
        ]
        
        for pattern in gender_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                gender = match.group(1).lower()
                if gender in ['m', 'male']:
                    patient_info['gender'] = 'male'
                elif gender in ['f', 'female']:
                    patient_info['gender'] = 'female'
                break
        
        return patient_info
    
    def extract_test_dates(self, text: str) -> List[str]:
        """Extract test dates from report text"""
        date_patterns = [
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b',
            r'\b([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b'
        ]
        
        dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            dates.extend(matches)
        
        return list(set(dates))  # Remove duplicates
    
    def extract_doctor_comments(self, text: str) -> List[str]:
        """Extract doctor's comments or interpretations"""
        comment_patterns = [
            r'Comment[:\s]+([^.\n]+)',
            r'Interpretation[:\s]+([^.\n]+)',
            r'Note[:\s]+([^.\n]+)',
            r'Remarks[:\s]+([^.\n]+)'
        ]
        
        comments = []
        for pattern in comment_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            comments.extend(matches)
        
        return comments
    
    def identify_test_categories(self, text: str) -> List[str]:
        """Identify what types of tests are in the report"""
        categories = []
        
        category_keywords = {
            'Complete Blood Count (CBC)': ['cbc', 'complete blood count', 'hemoglobin', 'hematocrit', 'white blood cell', 'platelet'],
            'Lipid Profile': ['lipid', 'cholesterol', 'triglyceride', 'hdl', 'ldl'],
            'Basic Metabolic Panel': ['bmp', 'basic metabolic', 'glucose', 'sodium', 'potassium', 'creatinine'],
            'Thyroid Function': ['thyroid', 'tsh', 't3', 't4'],
            'Liver Function': ['liver', 'alt', 'ast', 'bilirubin', 'alkaline phosphatase']
        }
        
        text_lower = text.lower()
        for category, keywords in category_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                categories.append(category)
        
        return categories