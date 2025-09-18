import unittest
import tempfile
import os
from unittest.mock import patch, MagicMock
from werkzeug.test import Client
from app import create_app
from app.api_routes import api_bp

class TestAPIRoutes(unittest.TestCase):
    
    def setUp(self):
        """Set up test client"""
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get('/api/health')
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')
    
    def test_get_disclaimers(self):
        """Test disclaimers endpoint"""
        response = self.client.get('/api/disclaimers')
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('disclaimers', data)
        self.assertIsInstance(data['disclaimers'], list)
    
    def test_get_test_parameters(self):
        """Test test parameters endpoint"""
        response = self.client.get('/api/test-parameters')
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('parameters', data)
        self.assertIsInstance(data['parameters'], list)
    
    def test_demo_analysis(self):
        """Test demo analysis endpoint"""
        response = self.client.get('/api/demo-analysis')
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertTrue(data['demo'])
        self.assertIn('analysis', data)
    
    def test_analyze_text_valid(self):
        """Test text analysis with valid data"""
        test_data = {
            'text': 'Hemoglobin: 8.5 g/dL\nTotal Cholesterol: 250 mg/dL',
            'gender': 'male'
        }
        
        response = self.client.post('/api/analyze-text', 
                                  json=test_data,
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('analysis', data)
    
    def test_analyze_text_empty(self):
        """Test text analysis with empty text"""
        test_data = {'text': ''}
        
        response = self.client.post('/api/analyze-text', 
                                  json=test_data,
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('error', data)
    
    def test_analyze_text_no_values(self):
        """Test text analysis with text containing no medical values"""
        test_data = {'text': 'This is just some random text with no medical data.'}
        
        response = self.client.post('/api/analyze-text', 
                                  json=test_data,
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data['success'])
        self.assertIn('No medical test values', data['error'])
    
    def test_upload_no_file(self):
        """Test file upload with no file"""
        response = self.client.post('/api/upload')
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('No file provided', data['error'])
    
    def test_upload_empty_filename(self):
        """Test file upload with empty filename"""
        response = self.client.post('/api/upload', 
                                  data={'file': (tempfile.NamedTemporaryFile(), '')})
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('No file selected', data['error'])
    
    def test_upload_invalid_file_type(self):
        """Test file upload with invalid file type"""
        # Create a temporary file with invalid extension
        with tempfile.NamedTemporaryFile(suffix='.xyz', delete=False) as tmp:
            tmp.write(b'test content')
            tmp_path = tmp.name
        
        try:
            with open(tmp_path, 'rb') as f:
                response = self.client.post('/api/upload', 
                                          data={'file': (f, 'test.xyz')})
            
            self.assertEqual(response.status_code, 400)
            data = response.get_json()
            self.assertIn('File type not allowed', data['error'])
        finally:
            os.unlink(tmp_path)

if __name__ == '__main__':
    unittest.main()