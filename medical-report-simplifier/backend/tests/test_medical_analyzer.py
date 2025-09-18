import unittest
import json
import tempfile
import os
from app.pdf_processor import PDFProcessor
from app.ai_analyzer import MedicalAnalyzer

class TestPDFProcessor(unittest.TestCase):
    
    def setUp(self):
        self.processor = PDFProcessor()
    
    def test_extract_test_values_simple(self):
        """Test extraction of test values from simple text"""
        text = """
        Hemoglobin: 8.5 g/dL
        Total Cholesterol: 250 mg/dL
        Glucose: 150 mg/dL
        """
        
        results = self.processor.extract_test_values(text)
        
        self.assertIn('Hemoglobin', results)
        self.assertEqual(results['Hemoglobin']['value'], 8.5)
        self.assertEqual(results['Hemoglobin']['unit'], 'g/dL')
        
        self.assertIn('Total Cholesterol', results)
        self.assertEqual(results['Total Cholesterol']['value'], 250)
        self.assertEqual(results['Total Cholesterol']['unit'], 'mg/dL')
    
    def test_extract_test_values_with_ranges(self):
        """Test extraction with reference ranges"""
        text = """
        Hemoglobin: 8.5 g/dL (Normal: 12.0-16.0)
        WBC: 12.5 ×10³/μL (4.5-11.0)
        """
        
        results = self.processor.extract_test_values(text)
        
        self.assertIn('Hemoglobin', results)
        self.assertEqual(results['Hemoglobin']['value'], 8.5)
        
        self.assertIn('WBC', results)
        self.assertEqual(results['WBC']['value'], 12.5)
    
    def test_extract_test_values_empty_text(self):
        """Test extraction from empty text"""
        results = self.processor.extract_test_values("")
        self.assertEqual(len(results), 0)

class TestMedicalAnalyzer(unittest.TestCase):
    
    def setUp(self):
        # Create a temporary knowledge base for testing
        self.test_kb = {
            "test_parameters": {
                "Hemoglobin": {
                    "normal_ranges": {
                        "male": {"min": 13.8, "max": 17.2, "unit": "g/dL"},
                        "female": {"min": 12.1, "max": 15.1, "unit": "g/dL"},
                        "general": {"min": 12.0, "max": 17.0, "unit": "g/dL"}
                    },
                    "conditions": {
                        "low": {
                            "condition": "Anemia",
                            "explanation": "Your hemoglobin is low, which could indicate anemia.",
                            "severity": "moderate",
                            "recommendations": "Consult your doctor."
                        }
                    },
                    "category": "Complete Blood Count (CBC)"
                }
            },
            "severity_levels": {
                "moderate": {"color": "yellow", "priority": 2}
            },
            "disclaimers": ["For educational purposes only."]
        }
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(self.test_kb, f)
            self.temp_kb_path = f.name
        
        self.analyzer = MedicalAnalyzer(self.temp_kb_path)
    
    def tearDown(self):
        # Clean up temporary file
        if os.path.exists(self.temp_kb_path):
            os.unlink(self.temp_kb_path)
    
    def test_find_test_parameter(self):
        """Test finding test parameters"""
        param = self.analyzer.find_test_parameter("Hemoglobin")
        self.assertIsNotNone(param)
        self.assertEqual(param['category'], 'Complete Blood Count (CBC)')
    
    def test_determine_status_low(self):
        """Test status determination for low values"""
        normal_range = {"general": {"min": 12.0, "max": 17.0}}
        status = self.analyzer.determine_status(8.5, normal_range, "general")
        self.assertEqual(status, "low")
    
    def test_determine_status_high(self):
        """Test status determination for high values"""
        normal_range = {"general": {"min": 12.0, "max": 17.0}}
        status = self.analyzer.determine_status(18.0, normal_range, "general")
        self.assertEqual(status, "high")
    
    def test_determine_status_normal(self):
        """Test status determination for normal values"""
        normal_range = {"general": {"min": 12.0, "max": 17.0}}
        status = self.analyzer.determine_status(14.0, normal_range, "general")
        self.assertEqual(status, "normal")
    
    def test_analyze_single_test(self):
        """Test analysis of a single test"""
        result = self.analyzer.analyze_single_test("Hemoglobin", 8.5, "general")
        
        self.assertEqual(result['test_name'], 'Hemoglobin')
        self.assertEqual(result['value'], 8.5)
        self.assertEqual(result['status'], 'low')
        self.assertEqual(result['severity'], 'moderate')
        self.assertIn('anemia', result['explanation'].lower())
    
    def test_analyze_test_results(self):
        """Test analysis of multiple test results"""
        test_data = {
            'Hemoglobin': {'value': 8.5, 'unit': 'g/dL'}
        }
        
        result = self.analyzer.analyze_test_results(test_data, "general")
        
        self.assertEqual(result['summary']['total_tests'], 1)
        self.assertEqual(result['summary']['abnormal_count'], 1)
        self.assertEqual(len(result['analyzed_results']), 1)
        self.assertIn('disclaimer', result['overall_assessment'].lower() or 
                     len(result['disclaimers']) > 0)
    
    def test_extract_patient_info(self):
        """Test patient information extraction"""
        text = """
        Patient Name: John Doe
        Age: 43 years
        Gender: Male
        """
        
        info = self.analyzer.extract_patient_info(text)
        
        self.assertEqual(info['name'], 'John Doe')
        self.assertEqual(info['age'], 43)
        self.assertEqual(info['gender'], 'male')
    
    def test_generate_patient_friendly_explanation(self):
        """Test patient-friendly explanation generation"""
        analysis = {
            'status': 'low',
            'explanation': 'Your hemoglobin is low, which could indicate anemia.',
            'normal_range': '12.0-17.0 g/dL',
            'unit': 'g/dL'
        }
        
        explanation = self.analyzer.generate_patient_friendly_explanation(
            'Hemoglobin', 8.5, analysis
        )
        
        self.assertIn('Hemoglobin', explanation)
        self.assertIn('8.5', explanation)
        self.assertIn('g/dL', explanation)

class TestIntegration(unittest.TestCase):
    
    def setUp(self):
        self.processor = PDFProcessor()
        self.analyzer = MedicalAnalyzer()
    
    def test_full_analysis_pipeline(self):
        """Test the full analysis pipeline"""
        # Sample medical report text
        text = """
        LABORATORY REPORT
        
        Patient: John Doe
        Age: 43 years
        Gender: Male
        
        COMPLETE BLOOD COUNT
        Hemoglobin: 8.5 g/dL (Normal: 12.0-16.0)
        Hematocrit: 25.2% (Normal: 40.0-50.0)
        White Blood Cell Count: 12.5 ×10³/μL (Normal: 4.5-11.0)
        
        LIPID PROFILE
        Total Cholesterol: 250 mg/dL (Normal: <200)
        HDL Cholesterol: 35 mg/dL (Normal: >40)
        """
        
        # Extract test values
        test_values = self.processor.extract_test_values(text)
        
        # Should extract multiple tests
        self.assertGreater(len(test_values), 0)
        
        # Analyze results
        analysis = self.analyzer.analyze_test_results(test_values, "male")
        
        # Should have analysis results
        self.assertIn('analyzed_results', analysis)
        self.assertIn('summary', analysis)
        self.assertIn('overall_assessment', analysis)
        
        # Should detect abnormal values
        self.assertGreater(analysis['summary']['abnormal_count'], 0)

if __name__ == '__main__':
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTest(unittest.makeSuite(TestPDFProcessor))
    test_suite.addTest(unittest.makeSuite(TestMedicalAnalyzer))
    test_suite.addTest(unittest.makeSuite(TestIntegration))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Exit with appropriate code
    exit(0 if result.wasSuccessful() else 1)