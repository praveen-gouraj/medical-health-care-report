import os
import json
import google.generativeai as genai
from typing import Dict, List, Any, Optional
import logging
from dotenv import load_dotenv
import time

load_dotenv()

class GeminiMedicalAnalyzer:
    """Gemini AI-powered medical report analyzer"""
    
    def __init__(self):
        """Initialize the Gemini analyzer"""
        self.logger = logging.getLogger(__name__)
        
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            self.logger.error("GEMINI_API_KEY not found in environment variables")
            raise ValueError("GEMINI_API_KEY is required")
        
        genai.configure(api_key=api_key)
        
        # Use efficient flash model to reduce quota usage
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.fallback_models = [
            'gemini-2.0-flash-lite',
            'gemini-1.5-flash-8b',
            'gemini-2.5-flash-lite'
        ]
        
        # Load knowledge base for reference ranges
        self._load_knowledge_base()
        
    def _load_knowledge_base(self):
        """Load medical knowledge base for reference ranges"""
        try:
            kb_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'medical_knowledge_base.json')
            with open(kb_path, 'r') as file:
                self.knowledge_base = json.load(file)
        except Exception as e:
            self.logger.error(f"Error loading knowledge base: {e}")
            self.knowledge_base = {"test_parameters": {}}
    
    def analyze_medical_report(self, text: str, patient_info: Dict = None) -> Dict:
        """
        Analyze medical report using Gemini AI with quota-aware error handling
        
        Args:
            text: Medical report text
            patient_info: Optional patient demographics
            
        Returns:
            Dict containing AI analysis results
        """
        try:
            # Construct the prompt for medical analysis
            prompt = self._create_analysis_prompt(text, patient_info)
            
            # Try with primary model first
            response = self._generate_with_fallback(prompt)
            
            # Parse and structure the response
            analysis = self._parse_gemini_response(response.text)
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error in Gemini analysis: {e}")
            return self._fallback_analysis(text)
    
    def _generate_with_fallback(self, prompt: str):
        """Generate content with model fallback for quota issues"""
        try:
            # Try primary model
            return self.model.generate_content(prompt)
        except Exception as e:
            # Check if it's a quota issue
            if "quota" in str(e).lower() or "429" in str(e) or "ResourceExhausted" in str(e):
                self.logger.warning(f"Quota exceeded for primary model, trying fallback models: {e}")
                
                # Try fallback models
                for fallback_model_name in self.fallback_models:
                    try:
                        fallback_model = genai.GenerativeModel(fallback_model_name)
                        return fallback_model.generate_content(prompt)
                    except Exception as fallback_e:
                        self.logger.warning(f"Fallback model {fallback_model_name} failed: {fallback_e}")
                        continue
                
                # If all models fail, raise the original error
                raise e
            else:
                # Re-raise non-quota errors immediately
                raise e
    
    def _create_analysis_prompt(self, text: str, patient_info: Dict = None) -> str:
        """Create a structured prompt for Gemini analysis"""
        
        patient_context = ""
        if patient_info:
            age = patient_info.get('age', 'Unknown')
            gender = patient_info.get('gender', 'Unknown')
            patient_context = f"Patient: {age} years old, {gender}"
        
        prompt = f"""
You are a medical AI assistant specialized in analyzing medical test reports. Please analyze the following medical report and provide insights in a structured JSON format.

{patient_context}

Medical Report:
{text}

Please provide analysis in the following JSON structure:
{{
    "health_score": number (0-100, overall health assessment),
    "risk_score": number (0-10, overall risk level),
    "categories": [
        {{
            "name": "string (test category name)",
            "status": "normal|borderline|abnormal|critical",
            "risk_level": number (0-10),
            "findings": ["list of specific findings"],
            "recommendations": ["list of recommendations"]
        }}
    ],
    "key_findings": [
        {{
            "parameter": "string (test name)",
            "value": "string (test value)",
            "reference_range": "string (normal range)",
            "status": "normal|low|high|critical",
            "significance": "string (clinical significance)",
            "trend": "improving|stable|worsening|unknown"
        }}
    ],
    "recommendations": [
        {{
            "type": "lifestyle|dietary|medical|follow_up",
            "priority": "high|medium|low",
            "description": "string (detailed recommendation)",
            "timeline": "string (when to implement)"
        }}
    ],
    "red_flags": ["list of concerning findings that need immediate attention"],
    "follow_up": {{
        "recommended": boolean,
        "timeline": "string (when to follow up)",
        "tests": ["list of recommended follow-up tests"],
        "specialist": "string (specialist type if needed)"
    }},
    "summary": "string (brief summary in patient-friendly language)",
    "education": [
        {{
            "topic": "string (health topic)",
            "explanation": "string (simple explanation)",
            "importance": "high|medium|low"
        }}
    ]
}}

Guidelines:
- Use patient-friendly language in explanations
- Focus on actionable insights
- Highlight both positive findings and areas for improvement
- Consider age and gender in your assessment
- Provide specific, evidence-based recommendations
- Flag any critical values that need immediate medical attention

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.
"""
        return prompt
    
    def _parse_gemini_response(self, response_text: str) -> Dict:
        """Parse and validate Gemini's JSON response"""
        try:
            # Clean the response text
            response_text = response_text.strip()
            
            # Remove any markdown code block formatting
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Parse JSON
            analysis = json.loads(response_text)
            
            # Validate required fields
            required_fields = ['health_score', 'risk_score', 'categories', 'key_findings', 'recommendations']
            for field in required_fields:
                if field not in analysis:
                    raise ValueError(f"Missing required field: {field}")
            
            # Ensure scores are within valid ranges
            analysis['health_score'] = max(0, min(100, analysis.get('health_score', 50)))
            analysis['risk_score'] = max(0, min(10, analysis.get('risk_score', 5)))
            
            return analysis
            
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON in Gemini response: {e}")
            return self._fallback_analysis_structure()
        except Exception as e:
            self.logger.error(f"Error parsing Gemini response: {e}")
            return self._fallback_analysis_structure()
    
    def _fallback_analysis(self, text: str) -> Dict:
        """Provide fallback analysis when Gemini fails"""
        return {
            "health_score": 75,
            "risk_score": 3,
            "categories": [
                {
                    "name": "General Health",
                    "status": "normal",
                    "risk_level": 3,
                    "findings": ["Report processed with limited AI analysis"],
                    "recommendations": ["Consult healthcare provider for detailed interpretation"]
                }
            ],
            "key_findings": [
                {
                    "parameter": "AI Analysis",
                    "value": "Limited",
                    "reference_range": "N/A",
                    "status": "normal",
                    "significance": "AI analysis temporarily unavailable",
                    "trend": "unknown"
                }
            ],
            "recommendations": [
                {
                    "type": "medical",
                    "priority": "medium",
                    "description": "Discuss results with your healthcare provider",
                    "timeline": "Within 1-2 weeks"
                }
            ],
            "red_flags": [],
            "follow_up": {
                "recommended": True,
                "timeline": "As advised by healthcare provider",
                "tests": [],
                "specialist": ""
            },
            "summary": "Your medical report has been processed. Please consult with your healthcare provider for detailed interpretation and personalized advice.",
            "education": [
                {
                    "topic": "Regular Health Monitoring",
                    "explanation": "Regular health check-ups help maintain good health and catch potential issues early.",
                    "importance": "high"
                }
            ],
            "ai_status": "fallback",
            "message": "AI analysis temporarily unavailable. Basic report processing completed."
        }
    
    def _fallback_analysis_structure(self) -> Dict:
        """Return a properly structured fallback analysis"""
        return self._fallback_analysis("")
    
    def get_ai_insights(self, analysis_data: Dict) -> Dict:
        """Get additional AI insights based on analysis data"""
        try:
            insights_prompt = f"""
Based on the following medical analysis data, provide additional insights and health improvement suggestions:

Analysis Data:
{json.dumps(analysis_data, indent=2)}

Please provide insights in the following JSON format:
{{
    "health_insights": [
        {{
            "category": "string (insight category)",
            "insight": "string (detailed insight)",
            "confidence": "high|medium|low"
        }}
    ],
    "lifestyle_recommendations": [
        {{
            "area": "diet|exercise|sleep|stress|habits",
            "recommendation": "string (specific recommendation)",
            "expected_benefit": "string (what improvement to expect)",
            "difficulty": "easy|moderate|challenging"
        }}
    ],
    "risk_mitigation": [
        {{
            "risk": "string (identified risk)",
            "mitigation_strategy": "string (how to reduce risk)",
            "priority": "high|medium|low"
        }}
    ],
    "positive_aspects": [
        "string (positive findings to acknowledge)"
    ],
    "areas_for_improvement": [
        "string (areas that could be optimized)"
    ]
}}

IMPORTANT: Respond ONLY with valid JSON.
"""
            
            response = self.model.generate_content(insights_prompt)
            return self._parse_insights_response(response.text)
            
        except Exception as e:
            self.logger.error(f"Error generating AI insights: {e}")
            return {
                "health_insights": [],
                "lifestyle_recommendations": [],
                "risk_mitigation": [],
                "positive_aspects": ["Report successfully analyzed"],
                "areas_for_improvement": ["Consult healthcare provider for personalized advice"]
            }
    
    def _parse_insights_response(self, response_text: str) -> Dict:
        """Parse insights response from Gemini"""
        try:
            # Clean the response
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            return json.loads(response_text)
            
        except Exception as e:
            self.logger.error(f"Error parsing insights response: {e}")
            return {
                "health_insights": [],
                "lifestyle_recommendations": [],
                "risk_mitigation": [],
                "positive_aspects": [],
                "areas_for_improvement": []
            }
    
    def explain_parameter(self, parameter_name: str, value: str, context: str = "") -> str:
        """Get AI explanation for a specific medical parameter"""
        try:
            explain_prompt = f"""
Explain the medical parameter "{parameter_name}" with value "{value}" in simple, patient-friendly language.

Context: {context}

Please provide:
1. What this parameter measures
2. What the value means
3. Whether it's normal or concerning
4. Simple lifestyle factors that can influence it

Keep the explanation clear, concise, and reassuring where appropriate.
"""
            
            response = self.model.generate_content(explain_prompt)
            return response.text
            
        except Exception as e:
            self.logger.error(f"Error explaining parameter: {e}")
            return f"This parameter ({parameter_name}) measures an important aspect of your health. Please discuss the value ({value}) with your healthcare provider for personalized interpretation."