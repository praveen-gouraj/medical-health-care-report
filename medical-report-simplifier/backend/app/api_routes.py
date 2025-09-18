from flask import Blueprint, request, jsonify, current_app
import os
import tempfile
from werkzeug.utils import secure_filename
from .pdf_processor import PDFProcessor
from .ai_analyzer import MedicalAnalyzer
from .enhanced_ai_analyzer import EnhancedMedicalAIAnalyzer
from .gemini_analyzer import GeminiMedicalAnalyzer
from .config import config
import logging

# Create blueprint
api_bp = Blueprint('api', __name__)

# Initialize processors
pdf_processor = PDFProcessor()
medical_analyzer = MedicalAnalyzer()
enhanced_analyzer = EnhancedMedicalAIAnalyzer()

# Initialize Gemini analyzer (with error handling)
try:
    gemini_analyzer = GeminiMedicalAnalyzer()
    gemini_available = True
except Exception as e:
    logging.warning(f"Gemini analyzer not available: {e}")
    gemini_analyzer = None
    gemini_available = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Medical Report Simplifier API v2.0 - Enhanced AI Edition',
        'version': '2.0.0',
        'features': ['enhanced_ai', 'health_scoring', 'risk_assessment', 'personalized_recommendations']
    })

@api_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload and process medical report file"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload PDF or TXT files only.'}), 400
        
        # Get optional parameters
        gender = request.form.get('gender', 'general')
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp_file:
            file.save(tmp_file.name)
            temp_file_path = tmp_file.name
        
        try:
            # Process the file
            if filename.lower().endswith('.pdf'):
                # Process PDF
                extracted_data = pdf_processor.process_medical_report(temp_file_path)
                raw_text = extracted_data['raw_text']
                test_values = extracted_data['test_values']
            else:
                # Process text file
                with open(temp_file_path, 'r', encoding='utf-8') as f:
                    raw_text = f.read()
                test_values = pdf_processor.extract_test_values(raw_text)
            
            # Analyze test results
            if test_values:
                analysis_result = medical_analyzer.analyze_test_results(test_values, gender)
                
                # Perform smart text analysis
                smart_analysis = medical_analyzer.smart_text_analysis(raw_text)
                analysis_result['smart_analysis'] = smart_analysis
                
                # Generate patient-friendly summaries
                friendly_explanations = []
                for result in analysis_result['analyzed_results']:
                    friendly_explanation = medical_analyzer.generate_patient_friendly_explanation(
                        result['test_name'], 
                        result['value'], 
                        result
                    )
                    friendly_explanations.append({
                        'test_name': result['test_name'],
                        'friendly_explanation': friendly_explanation,
                        'severity': result['severity'],
                        'status': result['status']
                    })
                
                analysis_result['friendly_explanations'] = friendly_explanations
                
                return jsonify({
                    'success': True,
                    'filename': filename,
                    'extracted_text_length': len(raw_text),
                    'tests_found': len(test_values),
                    'analysis': analysis_result
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'No medical test values could be extracted from the file',
                    'filename': filename,
                    'extracted_text_length': len(raw_text),
                    'raw_text_preview': raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
                }), 400
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@api_bp.route('/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze medical test results from raw text input"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        raw_text = data['text']
        gender = data.get('gender', 'general')
        
        # Extract test values from text
        test_values = pdf_processor.extract_test_values(raw_text)
        
        if not test_values:
            return jsonify({
                'success': False,
                'error': 'No medical test values could be extracted from the text',
                'text_length': len(raw_text)
            }), 400
        
        # Analyze test results
        analysis_result = medical_analyzer.analyze_test_results(test_values, gender)
        
        # Perform smart text analysis
        smart_analysis = medical_analyzer.smart_text_analysis(raw_text)
        analysis_result['smart_analysis'] = smart_analysis
        
        # Generate patient-friendly summaries
        friendly_explanations = []
        for result in analysis_result['analyzed_results']:
            friendly_explanation = medical_analyzer.generate_patient_friendly_explanation(
                result['test_name'], 
                result['value'], 
                result
            )
            friendly_explanations.append({
                'test_name': result['test_name'],
                'friendly_explanation': friendly_explanation,
                'severity': result['severity'],
                'status': result['status']
            })
        
        analysis_result['friendly_explanations'] = friendly_explanations
        
        return jsonify({
            'success': True,
            'text_length': len(raw_text),
            'tests_found': len(test_values),
            'analysis': analysis_result
        })
    
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return jsonify({'error': f'Error analyzing text: {str(e)}'}), 500

@api_bp.route('/test-parameters', methods=['GET'])
def get_test_parameters():
    """Get available test parameters from knowledge base"""
    try:
        test_parameters = medical_analyzer.knowledge_base.get('test_parameters', {})
        
        # Return simplified list for frontend
        parameters_list = []
        for param_name, param_data in test_parameters.items():
            parameters_list.append({
                'name': param_name,
                'category': param_data.get('category', 'Unknown'),
                'aliases': param_data.get('aliases', []),
                'normal_ranges': param_data.get('normal_ranges', {})
            })
        
        return jsonify({
            'success': True,
            'parameters': parameters_list,
            'total_count': len(parameters_list)
        })
    
    except Exception as e:
        logger.error(f"Error getting test parameters: {str(e)}")
        return jsonify({'error': f'Error getting test parameters: {str(e)}'}), 500

@api_bp.route('/disclaimers', methods=['GET'])
def get_disclaimers():
    """Get medical disclaimers"""
    try:
        disclaimers = medical_analyzer.knowledge_base.get('disclaimers', [])
        
        return jsonify({
            'success': True,
            'disclaimers': disclaimers
        })
    
    except Exception as e:
        logger.error(f"Error getting disclaimers: {str(e)}")
        return jsonify({'error': f'Error getting disclaimers: {str(e)}'}), 500

@api_bp.route('/demo-analysis', methods=['GET'])
def demo_analysis():
    """Provide a demo analysis with sample data"""
    try:
        # Sample test data
        sample_test_data = {
            'Hemoglobin': {'value': 8.5, 'unit': 'g/dL', 'reference_range': '12-16 g/dL'},
            'Total Cholesterol': {'value': 250, 'unit': 'mg/dL', 'reference_range': '<200 mg/dL'},
            'Glucose': {'value': 150, 'unit': 'mg/dL', 'reference_range': '70-100 mg/dL'},
            'HDL Cholesterol': {'value': 35, 'unit': 'mg/dL', 'reference_range': '>40 mg/dL'}
        }
        
        # Analyze sample data
        analysis_result = medical_analyzer.analyze_test_results(sample_test_data, 'general')
        
        # Generate patient-friendly summaries
        friendly_explanations = []
        for result in analysis_result['analyzed_results']:
            friendly_explanation = medical_analyzer.generate_patient_friendly_explanation(
                result['test_name'], 
                result['value'], 
                result
            )
            friendly_explanations.append({
                'test_name': result['test_name'],
                'friendly_explanation': friendly_explanation,
                'severity': result['severity'],
                'status': result['status']
            })
        
        analysis_result['friendly_explanations'] = friendly_explanations
        
        return jsonify({
            'success': True,
            'demo': True,
            'sample_data': sample_test_data,
            'analysis': analysis_result
        })
    
    except Exception as e:
        logger.error(f"Error generating demo analysis: {str(e)}")
        return jsonify({'error': f'Error generating demo analysis: {str(e)}'}), 500

@api_bp.route('/enhanced-analysis', methods=['POST'])
def enhanced_analysis():
    """Enhanced AI analysis with health scoring and risk assessment"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided for analysis'}), 400
        
        text = data['text']
        patient_info = data.get('patient_info', {})
        
        if len(text.strip()) < 10:
            return jsonify({'error': 'Text too short for meaningful analysis'}), 400
        
        # Use enhanced analyzer
        result = enhanced_analyzer.analyze_text(text, patient_info)
        
        return jsonify({
            'success': True,
            'analysis': result,
            'patient_info': patient_info,
            'api_version': '2.0.0'
        })
        
    except Exception as e:
        logger.error(f"Enhanced analysis failed: {str(e)}")
        return jsonify({'error': f'Enhanced analysis failed: {str(e)}'}), 500

@api_bp.route('/health-score', methods=['POST'])
def calculate_health_score():
    """Calculate comprehensive health score from test results"""
    try:
        data = request.get_json()
        if not data or 'results' not in data:
            return jsonify({'error': 'No test results provided'}), 400
        
        results = data['results']
        patient_info = data.get('patient_info', {})
        
        # Calculate comprehensive health metrics
        total_risk = sum(result.get('risk_score', 0) for result in results)
        health_score = enhanced_analyzer._calculate_health_score(total_risk, len(results))
        health_grade = enhanced_analyzer._get_health_grade(health_score)
        
        # Generate insights and recommendations
        insights = enhanced_analyzer._generate_health_insights(results, health_score)
        recommendations = enhanced_analyzer._generate_personalized_recommendations(results, health_score)
        
        return jsonify({
            'success': True,
            'health_score': health_score,
            'health_grade': health_grade,
            'insights': insights,
            'recommendations': recommendations,
            'risk_assessment': {
                'total_risk_score': total_risk,
                'average_risk': total_risk / len(results) if results else 0,
                'risk_level': 'low' if health_score >= 80 else 'moderate' if health_score >= 60 else 'high'
            },
            'api_version': '2.0.0'
        })
        
    except Exception as e:
        logger.error(f"Health score calculation failed: {str(e)}")
        return jsonify({'error': f'Health score calculation failed: {str(e)}'}), 500

@api_bp.route('/insights', methods=['POST'])
def generate_insights():
    """Generate personalized health insights"""
    try:
        data = request.get_json()
        if not data or 'analysis' not in data:
            return jsonify({'error': 'No analysis data provided'}), 400
        
        analysis = data['analysis']
        results = analysis.get('results', [])
        health_score = analysis.get('health_score', 50)
        
        # Generate comprehensive insights
        insights = enhanced_analyzer._generate_health_insights(results, health_score)
        recommendations = enhanced_analyzer._generate_personalized_recommendations(results, health_score)
        summary = enhanced_analyzer._generate_summary(results, health_score)
        
        # Additional insights based on patterns
        category_analysis = {}
        for result in results:
            category = result.get('category', 'General')
            if category not in category_analysis:
                category_analysis[category] = {'count': 0, 'abnormal': 0, 'risk_total': 0}
            category_analysis[category]['count'] += 1
            if result.get('status') != 'normal':
                category_analysis[category]['abnormal'] += 1
            category_analysis[category]['risk_total'] += result.get('risk_score', 0)
        
        return jsonify({
            'success': True,
            'insights': insights,
            'recommendations': recommendations,
            'summary': summary,
            'category_analysis': category_analysis,
            'health_trends': {
                'improvement_areas': [r['name'] for r in results if r.get('risk_score', 0) > 5],
                'stable_parameters': [r['name'] for r in results if r.get('status') == 'normal'],
                'monitoring_needed': [r['name'] for r in results if r.get('urgency') == 'moderate']
            },
            'api_version': '2.0.0'
        })
        
    except Exception as e:
        logger.error(f"Insights generation failed: {str(e)}")
        return jsonify({'error': f'Insights generation failed: {str(e)}'}), 500

@api_bp.route('/ai-analyze', methods=['POST'])
def ai_analyze_with_gemini():
    """Enhanced AI analysis using Gemini AI"""
    try:
        if not gemini_available:
            return jsonify({
                'error': 'Gemini AI not available',
                'fallback': True,
                'message': 'Using enhanced rule-based analysis instead'
            }), 200
            
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided for analysis'}), 400
        
        text = data['text']
        patient_info = data.get('patient_info', {})
        
        # Get AI analysis from Gemini
        ai_analysis = gemini_analyzer.analyze_medical_report(text, patient_info)
        
        # Enhance with additional insights
        ai_insights = gemini_analyzer.get_ai_insights(ai_analysis)
        
        # Combine with rule-based analysis for comparison
        enhanced_analysis = enhanced_analyzer.analyze_text(text, patient_info)
        
        result = {
            'ai_analysis': ai_analysis,
            'ai_insights': ai_insights,
            'enhanced_analysis': enhanced_analysis,
            'analysis_type': 'gemini_ai',
            'confidence': 'high' if gemini_available else 'medium',
            'timestamp': enhanced_analysis.get('timestamp', ''),
            'api_version': '3.0.0'
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}")
        # Fallback to enhanced analysis
        try:
            enhanced_analysis = enhanced_analyzer.analyze_text(data.get('text', ''), data.get('patient_info', {}))
            return jsonify({
                'analysis': enhanced_analysis,
                'fallback': True,
                'message': f'AI analysis failed, using enhanced analysis: {str(e)}',
                'analysis_type': 'enhanced_fallback'
            })
        except Exception as fallback_error:
            return jsonify({'error': f'All analysis methods failed: {str(fallback_error)}'}), 500

@api_bp.route('/ai-explain/<parameter_name>', methods=['POST'])
def ai_explain_parameter(parameter_name):
    """Get AI explanation for a specific medical parameter"""
    try:
        if not gemini_available:
            return jsonify({
                'error': 'Gemini AI not available',
                'explanation': f'Please consult your healthcare provider about {parameter_name}.'
            }), 200
            
        data = request.get_json()
        value = data.get('value', '')
        context = data.get('context', '')
        
        explanation = gemini_analyzer.explain_parameter(parameter_name, value, context)
        
        return jsonify({
            'parameter': parameter_name,
            'value': value,
            'explanation': explanation,
            'source': 'gemini_ai'
        })
        
    except Exception as e:
        logger.error(f"Parameter explanation failed: {str(e)}")
        return jsonify({
            'parameter': parameter_name,
            'explanation': f'Please consult your healthcare provider about {parameter_name} and its value.',
            'error': str(e)
        }), 500

@api_bp.route('/ai-status', methods=['GET'])
def ai_status():
    """Check AI services status with detailed quota information"""
    try:
        # Test Gemini API status
        gemini_status = _test_gemini_api()
        
        return jsonify({
            'gemini': gemini_status,
            'enhanced_analyzer': True,
            'rule_based_analyzer': True,
            'api_version': '3.0.0',
            'features': {
                'ai_analysis': gemini_status['available'],
                'parameter_explanation': gemini_status['available'],
                'enhanced_analysis': True,
                'rule_based_analysis': True,
                'quota_monitoring': True
            },
            'recommendations': _get_api_recommendations(gemini_status)
        })
    except Exception as e:
        return jsonify({
            'error': f'Error checking AI status: {str(e)}',
            'enhanced_analyzer': True,
            'rule_based_analyzer': True
        }), 500

def _test_gemini_api():
    """Test Gemini API and return detailed status"""
    try:
        import google.generativeai as genai
        
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {
                'available': False,
                'status': 'no_api_key',
                'message': 'GEMINI_API_KEY not configured',
                'models': []
            }
        
        genai.configure(api_key=api_key)
        
        # Try to list models first (lightweight operation)
        models = list(genai.list_models())
        available_models = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
        
        # Try a minimal test request
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Test", generation_config={'max_output_tokens': 5})
            
            return {
                'available': True,
                'status': 'operational',
                'message': 'Gemini API working correctly',
                'models': available_models[:5],  # First 5 models
                'current_model': 'gemini-1.5-flash',
                'quota_status': 'normal'
            }
        except Exception as test_error:
            error_str = str(test_error)
            if "quota" in error_str.lower() or "429" in error_str or "ResourceExhausted" in str(type(test_error)):
                return {
                    'available': False,
                    'status': 'quota_exceeded',
                    'message': 'API quota exceeded - service temporarily unavailable',
                    'models': available_models[:5],
                    'quota_status': 'exceeded',
                    'retry_after': _extract_retry_time(error_str)
                }
            else:
                return {
                    'available': False,
                    'status': 'api_error',
                    'message': f'API error: {error_str}',
                    'models': available_models[:5],
                    'quota_status': 'unknown'
                }
    
    except ImportError:
        return {
            'available': False,
            'status': 'missing_dependency',
            'message': 'google-generativeai package not installed',
            'models': []
        }
    except Exception as e:
        return {
            'available': False,
            'status': 'error',
            'message': f'Unexpected error: {str(e)}',
            'models': []
        }

def _extract_retry_time(error_message):
    """Extract retry time from quota error message"""
    import re
    match = re.search(r'retry in (\d+\.?\d*)s', error_message)
    if match:
        return float(match.group(1))
    return None

def _get_api_recommendations(gemini_status):
    """Get recommendations based on API status"""
    if not gemini_status['available']:
        if gemini_status['status'] == 'no_api_key':
            return [
                "Get a free Gemini API key from https://makersuite.google.com/app/apikey",
                "Add GEMINI_API_KEY to your .env file",
                "Restart the application"
            ]
        elif gemini_status['status'] == 'quota_exceeded':
            recommendations = [
                "Wait for quota to reset (typically daily for free tier)",
                "Consider upgrading to a paid plan for higher quotas",
                "Use the enhanced rule-based analyzer as fallback"
            ]
            if gemini_status.get('retry_after'):
                recommendations.insert(0, f"Retry in {gemini_status['retry_after']:.1f} seconds")
            return recommendations
        elif gemini_status['status'] == 'missing_dependency':
            return [
                "Install required package: pip install google-generativeai",
                "Restart the application"
            ]
    else:
        return [
            "Gemini AI is working correctly",
            "All analysis features available"
        ]

@api_bp.route('/system-status', methods=['GET'])
def system_status():
    """Comprehensive system status and capabilities"""
    try:
        capabilities = config.get_capabilities()
        
        return jsonify({
            'status': 'operational',
            'version': '3.0.0',
            'environment': config.flask_env,
            'capabilities': capabilities,
            'ai_services': {
                'gemini': gemini_available,
                'enhanced_analyzer': True,
                'rule_based_analyzer': True,
                'ocr_available': config.ai.has_ocr_capability(),
                'multi_ai_backup': config.ai.has_ai_capability()
            },
            'infrastructure': {
                'database': config.database.url != '',
                'cloud_storage': config.cloud.has_cloud_storage(),
                'email_service': config.email.has_email_configured(),
                'analytics': config.analytics.has_analytics_configured(),
                'authentication': config.security.has_oauth_configured()
            },
            'medical_features': {
                'fhir_integration': config.medical_apis.fhir_server_url != '',
                'medical_coding': config.medical_apis.has_medical_apis_configured(),
                'drug_interactions': config.medical_apis.drug_interaction_api_key != '',
                'multi_language': config.features.enable_multi_language,
                'supported_languages': config.supported_languages
            },
            'file_processing': {
                'max_file_size': config.max_file_size,
                'allowed_extensions': config.allowed_extensions,
                'ocr_enabled': config.features.enable_ocr_processing,
                'encryption_enabled': config.features.enable_file_encryption
            },
            'compliance': {
                'audit_logging': config.features.enable_audit_logging,
                'rate_limiting': config.features.enable_rate_limiting,
                'encryption': config.features.enable_file_encryption,
                'gdpr_ready': True,
                'hipaa_features': True
            },
            'sdg_impact': {
                'sdg_3_good_health': True,
                'sdg_10_reduced_inequalities': True,
                'global_accessibility': config.features.enable_multi_language,
                'impact_tracking': True
            }
        })
        
    except Exception as e:
        logger.error(f"System status check failed: {str(e)}")
        return jsonify({
            'status': 'partial',
            'error': str(e),
            'basic_functionality': True
        }), 200

# Error handlers
@api_bp.errorhandler(413)
def file_too_large(e):
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@api_bp.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@api_bp.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500