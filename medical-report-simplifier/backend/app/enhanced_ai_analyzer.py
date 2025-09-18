import json
import re
import os
from typing import Dict, List, Any, Tuple
import math

class EnhancedMedicalAIAnalyzer:
    def __init__(self):
        """Initialize the enhanced AI analyzer with medical knowledge base."""
        self.knowledge_base = self._load_knowledge_base()
        
    def _load_knowledge_base(self) -> Dict:
        """Load the medical knowledge base from JSON file."""
        try:
            kb_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'medical_knowledge_base.json')
            with open(kb_path, 'r') as file:
                return json.load(file)
        except Exception as e:
            print(f"Error loading knowledge base: {e}")
            return {"test_parameters": {}}
    
    def analyze_text(self, text: str, patient_info: Dict = None) -> Dict:
        """
        Enhanced AI analysis of medical report text with health scoring and risk assessment.
        
        Args:
            text: Medical report text
            patient_info: Optional patient information (age, gender, etc.)
            
        Returns:
            Comprehensive analysis results with scoring and recommendations
        """
        try:
            # Extract test results from text
            extracted_results = self._extract_test_results(text)
            
            # Analyze each parameter
            analyzed_results = []
            overall_risk_score = 0
            category_scores = {}
            
            for result in extracted_results:
                analysis = self._analyze_parameter(result, patient_info)
                if analysis:
                    analyzed_results.append(analysis)
                    overall_risk_score += analysis.get('risk_score', 0)
                    
                    # Track category scores
                    category = analysis.get('category', 'Other')
                    if category not in category_scores:
                        category_scores[category] = {'total_risk': 0, 'count': 0}
                    category_scores[category]['total_risk'] += analysis.get('risk_score', 0)
                    category_scores[category]['count'] += 1
            
            # Calculate health score (0-100, higher is better)
            health_score = self._calculate_health_score(overall_risk_score, len(analyzed_results))
            
            # Generate health insights and recommendations
            insights = self._generate_health_insights(analyzed_results, health_score)
            
            # Calculate category averages
            for category in category_scores:
                if category_scores[category]['count'] > 0:
                    category_scores[category]['average_risk'] = (
                        category_scores[category]['total_risk'] / category_scores[category]['count']
                    )
            
            return {
                'success': True,
                'results': analyzed_results,
                'health_score': health_score,
                'health_grade': self._get_health_grade(health_score),
                'overall_risk_score': overall_risk_score,
                'category_scores': category_scores,
                'insights': insights,
                'recommendations': self._generate_personalized_recommendations(analyzed_results, health_score),
                'extracted_count': len(extracted_results),
                'analyzed_count': len(analyzed_results),
                'summary': self._generate_summary(analyzed_results, health_score),
                'timestamp': self._get_timestamp()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Analysis failed: {str(e)}",
                'results': []
            }
    
    def _extract_test_results(self, text: str) -> List[Dict]:
        """Enhanced extraction of test results from medical report text."""
        results = []
        
        # Common medical test patterns with units
        patterns = [
            # Pattern: "Test Name: Value Unit" or "Test Name = Value Unit"
            r'([A-Za-z\s]+?)[:=]\s*(\d+\.?\d*)\s*([A-Za-z%/μ]+)?',
            # Pattern: "Test Name Value Unit"
            r'([A-Za-z\s]+?)\s+(\d+\.?\d*)\s*([A-Za-z%/μ]+)',
            # Pattern: "Value Unit Test Name"
            r'(\d+\.?\d*)\s*([A-Za-z%/μ]+)\s+([A-Za-z\s]+)',
            # Pattern: Test tables with more complex formatting
            r'([A-Za-z][A-Za-z\s]+)\s*[:\-]\s*(\d+\.?\d*)\s*([A-Za-z%/μ]*)'
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    groups = match.groups()
                    if len(groups) >= 2:
                        # Determine which group is the name and which is the value
                        if groups[0].replace('.', '').replace(',', '').isdigit():
                            # First group is value, last is name
                            name = groups[-1].strip()
                            value = float(groups[0])
                            unit = groups[1].strip() if len(groups) > 2 else ""
                        else:
                            # First group is name, second is value
                            name = groups[0].strip()
                            value = float(groups[1])
                            unit = groups[2].strip() if len(groups) > 2 else ""
                        
                        # Clean up the test name
                        name = self._clean_test_name(name)
                        
                        if self._is_valid_test_name(name) and value > 0:
                            results.append({
                                'name': name,
                                'value': value,
                                'unit': unit,
                                'raw_text': match.group(0),
                                'confidence': self._calculate_extraction_confidence(name, value, unit)
                            })
                except (ValueError, IndexError):
                    continue
        
        # Remove duplicates and keep the most confident entries
        return self._deduplicate_results(results)
    
    def _clean_test_name(self, name: str) -> str:
        """Clean and standardize test names."""
        # Remove common prefixes/suffixes
        name = re.sub(r'^(test|lab|result|value|level)[:=\s]*', '', name, flags=re.IGNORECASE)
        name = re.sub(r'[:=\s]*$', '', name)
        name = re.sub(r'\s+', ' ', name)  # Normalize whitespace
        
        # Common aliases mapping
        aliases = {
            'hgb': 'Hemoglobin',
            'hb': 'Hemoglobin',
            'hct': 'Hematocrit',
            'wbc': 'White Blood Cell Count',
            'rbc': 'Red Blood Cell Count',
            'plt': 'Platelets',
            'platelet count': 'Platelets',
            'chol': 'Total Cholesterol',
            'cholesterol total': 'Total Cholesterol',
            'trig': 'Triglycerides',
            'gluc': 'Glucose',
            'glucose fasting': 'Glucose',
            'bun': 'Blood Urea Nitrogen',
            'creat': 'Creatinine',
            'creatinine serum': 'Creatinine',
            'thyroid stimulating hormone': 'TSH',
            'free t4': 'T4',
            'thyroxine': 'T4'
        }
        
        name_lower = name.lower().strip()
        for alias, full_name in aliases.items():
            if alias in name_lower or name_lower in alias:
                return full_name
                
        return name.title().strip()
    
    def _is_valid_test_name(self, name: str) -> bool:
        """Check if the extracted name is a valid medical test."""
        # Must be at least 2 characters and contain letters
        if len(name) < 2 or not re.search(r'[A-Za-z]', name):
            return False
            
        # Skip common false positives
        false_positives = [
            'page', 'date', 'time', 'patient', 'doctor', 'report', 'lab', 
            'test', 'normal', 'high', 'low', 'range', 'ref', 'reference',
            'units', 'collected', 'received', 'ordered', 'phone', 'age'
        ]
        return name.lower() not in false_positives
    
    def _calculate_extraction_confidence(self, name: str, value: float, unit: str) -> float:
        """Calculate confidence score for extracted test result."""
        confidence = 0.5  # Base confidence
        
        # Boost confidence for recognized test names
        if any(name.lower() in param.lower() for param in self.knowledge_base.get('test_parameters', {})):
            confidence += 0.3
        
        # Boost confidence for common medical units
        medical_units = ['mg/dl', 'g/dl', 'cells/μl', 'miu/l', '%', 'μg/dl', 'mmol/l']
        if unit.lower() in [u.lower() for u in medical_units]:
            confidence += 0.2
        
        # Reasonable value range
        if 0.1 <= value <= 10000:
            confidence += 0.1
        
        return min(1.0, confidence)
    
    def _deduplicate_results(self, results: List[Dict]) -> List[Dict]:
        """Remove duplicate test results, keeping the most confident."""
        unique_results = {}
        
        for result in results:
            name = result['name']
            if (name not in unique_results or 
                result['confidence'] > unique_results[name]['confidence']):
                unique_results[name] = result
                
        return list(unique_results.values())
    
    def _analyze_parameter(self, result: Dict, patient_info: Dict = None) -> Dict:
        """Enhanced analysis of individual test parameter with risk scoring."""
        name = result['name']
        value = result['value']
        unit = result['unit']
        
        # Find matching parameter in knowledge base
        parameter_data = None
        for param_name, param_info in self.knowledge_base.get('test_parameters', {}).items():
            if (param_name.lower() == name.lower() or 
                name.lower() in [alias.lower() for alias in param_info.get('aliases', [])] or
                any(alias.lower() in name.lower() for alias in param_info.get('aliases', []))):
                parameter_data = param_info
                break
        
        if not parameter_data:
            return None
        
        # Determine appropriate normal range
        normal_range = self._get_normal_range(parameter_data, patient_info)
        if not normal_range:
            return None
        
        # Analyze the value
        status, condition_info = self._determine_status(value, normal_range, parameter_data)
        
        # Calculate risk score (0-10, higher is worse)
        risk_score = self._calculate_risk_score(value, normal_range, condition_info)
        
        # Get trend analysis if available
        trend = self._analyze_trend(name, value, patient_info)
        
        return {
            'name': name,
            'value': value,
            'unit': unit,
            'normal_range': normal_range,
            'status': status,
            'condition': condition_info.get('condition', 'Normal') if condition_info else 'Normal',
            'explanation': condition_info.get('explanation', 'Your value is within normal range.') if condition_info else 'Your value is within normal range.',
            'recommendations': condition_info.get('recommendations', 'Continue maintaining healthy lifestyle.') if condition_info else 'Continue maintaining healthy lifestyle.',
            'severity': condition_info.get('severity', 'normal') if condition_info else 'normal',
            'risk_score': risk_score,
            'symptoms': condition_info.get('symptoms', []) if condition_info else [],
            'urgency': condition_info.get('urgency', 'low') if condition_info else 'low',
            'lifestyle_tips': condition_info.get('lifestyle_tips', []) if condition_info else [],
            'category': parameter_data.get('category', 'General'),
            'importance': parameter_data.get('importance', 'medium'),
            'trend': trend,
            'percentage_deviation': self._calculate_percentage_deviation(value, normal_range),
            'confidence': result.get('confidence', 0.5)
        }
    
    def _get_normal_range(self, parameter_data: Dict, patient_info: Dict = None) -> Dict:
        """Get appropriate normal range based on patient info."""
        ranges = parameter_data.get('normal_ranges', {})
        
        if patient_info and patient_info.get('gender'):
            gender = patient_info['gender'].lower()
            if gender in ranges:
                return ranges[gender]
        
        # Default to general range or first available
        if 'general' in ranges:
            return ranges['general']
        elif ranges:
            return list(ranges.values())[0]
        
        return None
    
    def _determine_status(self, value: float, normal_range: Dict, parameter_data: Dict) -> Tuple[str, Dict]:
        """Determine if value is normal, high, or low."""
        min_val = normal_range.get('min', 0)
        max_val = normal_range.get('max', float('inf'))
        
        if value < min_val:
            status = 'low'
        elif value > max_val:
            status = 'high'
        else:
            status = 'normal'
        
        condition_info = None
        if status != 'normal':
            conditions = parameter_data.get('conditions', {})
            condition_info = conditions.get(status, {})
        
        return status, condition_info
    
    def _calculate_risk_score(self, value: float, normal_range: Dict, condition_info: Dict) -> int:
        """Calculate risk score from 0-10 based on deviation from normal."""
        if not condition_info:
            return 0
        
        min_val = normal_range.get('min', 0)
        max_val = normal_range.get('max', float('inf'))
        
        if value < min_val:
            # Calculate how far below minimum
            deviation = (min_val - value) / min_val if min_val > 0 else 0
        elif value > max_val:
            # Calculate how far above maximum
            deviation = (value - max_val) / max_val if max_val > 0 else 0
        else:
            return 0
        
        # Convert deviation to 0-10 scale
        base_score = min(10, deviation * 10)
        
        # Adjust based on severity and urgency
        severity_multipliers = {
            'mild': 0.5,
            'moderate': 1.0,
            'severe': 1.5,
            'critical': 2.0
        }
        
        urgency_multipliers = {
            'low': 0.8,
            'moderate': 1.0,
            'high': 1.3
        }
        
        severity = condition_info.get('severity', 'moderate')
        urgency = condition_info.get('urgency', 'moderate')
        
        severity_mult = severity_multipliers.get(severity, 1.0)
        urgency_mult = urgency_multipliers.get(urgency, 1.0)
        
        final_score = base_score * severity_mult * urgency_mult
        return min(10, int(final_score))
    
    def _calculate_percentage_deviation(self, value: float, normal_range: Dict) -> float:
        """Calculate percentage deviation from normal range."""
        min_val = normal_range.get('min', 0)
        max_val = normal_range.get('max', float('inf'))
        
        if min_val <= value <= max_val:
            return 0.0
        
        if value < min_val:
            return ((min_val - value) / min_val) * -100 if min_val > 0 else 0
        else:
            return ((value - max_val) / max_val) * 100 if max_val > 0 else 0
    
    def _analyze_trend(self, name: str, value: float, patient_info: Dict = None) -> Dict:
        """Analyze trends (placeholder for future implementation)."""
        return {
            'direction': 'stable',
            'confidence': 'low',
            'note': 'Trend analysis requires historical data',
            'prediction': 'Maintain current lifestyle for stable results'
        }
    
    def _calculate_health_score(self, total_risk: int, num_tests: int) -> int:
        """Calculate overall health score (0-100, higher is better)."""
        if num_tests == 0:
            return 50  # Neutral score
        
        avg_risk = total_risk / num_tests
        # Convert risk (0-10) to health score (100-0)
        health_score = max(0, 100 - (avg_risk * 10))
        return int(health_score)
    
    def _get_health_grade(self, score: int) -> str:
        """Convert health score to letter grade."""
        if score >= 90:
            return 'A+'
        elif score >= 85:
            return 'A'
        elif score >= 80:
            return 'B+'
        elif score >= 75:
            return 'B'
        elif score >= 70:
            return 'C+'
        elif score >= 65:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def _generate_health_insights(self, results: List[Dict], health_score: int) -> List[str]:
        """Generate health insights based on analysis."""
        insights = []
        
        # Overall health assessment
        if health_score >= 90:
            insights.append("🎉 Outstanding! Your test results indicate excellent health status.")
        elif health_score >= 80:
            insights.append("😊 Great news! Your health parameters are mostly within optimal ranges.")
        elif health_score >= 70:
            insights.append("👍 Good health overall, with some areas that could benefit from attention.")
        elif health_score >= 60:
            insights.append("⚠️ Fair health status. Several parameters would benefit from lifestyle improvements.")
        else:
            insights.append("🚨 Multiple health concerns detected. Consider consulting with healthcare providers.")
        
        # Category-specific insights
        categories = {}
        for result in results:
            category = result.get('category', 'General')
            if category not in categories:
                categories[category] = {'results': [], 'total_risk': 0}
            categories[category]['results'].append(result)
            categories[category]['total_risk'] += result.get('risk_score', 0)
        
        for category, data in categories.items():
            results_count = len(data['results'])
            avg_risk = data['total_risk'] / results_count if results_count > 0 else 0
            high_risk_count = sum(1 for r in data['results'] if r.get('risk_score', 0) > 6)
            
            if high_risk_count > 0:
                insights.append(f"🔍 {category}: {high_risk_count}/{results_count} parameter(s) need immediate attention.")
            elif avg_risk > 3:
                insights.append(f"💡 {category}: Monitor these parameters and consider lifestyle adjustments.")
            else:
                insights.append(f"✅ {category}: All parameters are in good ranges.")
        
        # Risk level insights
        high_risk_results = [r for r in results if r.get('urgency') == 'high']
        if high_risk_results:
            insights.append(f"🚨 {len(high_risk_results)} parameter(s) require urgent medical attention.")
        
        return insights
    
    def _generate_personalized_recommendations(self, results: List[Dict], health_score: int) -> Dict:
        """Generate personalized recommendations based on analysis."""
        recommendations = {
            'immediate': [],
            'lifestyle': [],
            'monitoring': [],
            'preventive': [],
            'dietary': [],
            'exercise': []
        }
        
        # Immediate actions for high-risk results
        urgent_results = [r for r in results if r.get('urgency') == 'high' or r.get('risk_score', 0) > 7]
        for result in urgent_results:
            recommendations['immediate'].append(
                f"📞 Consult your doctor immediately about {result['name']} - {result.get('condition', 'abnormal result')}"
            )
        
        # Lifestyle recommendations based on health score
        if health_score < 80:
            recommendations['lifestyle'].extend([
                "🌱 Adopt a Mediterranean-style diet rich in fruits, vegetables, and whole grains",
                "🚶‍♂️ Aim for at least 30 minutes of moderate exercise 5 days a week",
                "😴 Prioritize 7-9 hours of quality sleep each night",
                "🧘‍♀️ Practice stress management techniques like meditation or yoga"
            ])
        
        # Dietary recommendations
        cardiovascular_issues = any('cholesterol' in r['name'].lower() or 'triglyceride' in r['name'].lower() 
                                  for r in results if r.get('status') != 'normal')
        if cardiovascular_issues:
            recommendations['dietary'].extend([
                "🥑 Increase omega-3 fatty acids (fish, walnuts, flaxseeds)",
                "🥬 Eat more fiber-rich foods to help lower cholesterol",
                "🧂 Reduce sodium intake to less than 2300mg per day"
            ])
        
        blood_sugar_issues = any('glucose' in r['name'].lower() for r in results if r.get('status') != 'normal')
        if blood_sugar_issues:
            recommendations['dietary'].extend([
                "🍎 Choose complex carbohydrates over simple sugars",
                "🥜 Include protein with each meal to stabilize blood sugar",
                "⏰ Eat smaller, more frequent meals throughout the day"
            ])
        
        # Exercise recommendations
        if health_score < 75:
            recommendations['exercise'].extend([
                "💪 Include 2-3 strength training sessions per week",
                "❤️ Add cardiovascular exercise like brisk walking or swimming",
                "🤸‍♀️ Try flexibility exercises like stretching or yoga"
            ])
        
        # Monitoring recommendations
        recommendations['monitoring'].extend([
            "📊 Keep a health journal to track symptoms and improvements",
            "📅 Schedule regular check-ups every 6-12 months",
            "🩺 Follow up on any abnormal results in 4-6 weeks",
            "📱 Consider using health tracking apps for daily monitoring"
        ])
        
        # Preventive measures
        recommendations['preventive'].extend([
            "🚭 Avoid smoking and limit alcohol consumption",
            "💧 Stay well hydrated with 8-10 glasses of water daily",
            "💊 Take medications exactly as prescribed by your doctor",
            "🏥 Stay up to date with recommended health screenings"
        ])
        
        return recommendations
    
    def _generate_summary(self, results: List[Dict], health_score: int) -> str:
        """Generate a comprehensive summary of the analysis."""
        total_tests = len(results)
        normal_count = sum(1 for r in results if r.get('status') == 'normal')
        abnormal_count = total_tests - normal_count
        high_risk_count = sum(1 for r in results if r.get('risk_score', 0) > 6)
        
        summary = f"Comprehensive analysis of {total_tests} medical parameters completed. "
        summary += f"Health Score: {health_score}/100 (Grade: {self._get_health_grade(health_score)}). "
        
        if abnormal_count == 0:
            summary += "🎉 Excellent! All parameters are within normal ranges. Keep up the great work!"
        elif high_risk_count == 0:
            summary += f"✅ {normal_count} parameters are normal, {abnormal_count} show minor deviations that can be addressed with lifestyle changes."
        else:
            summary += f"⚠️ {normal_count} parameters normal, {abnormal_count} need attention, with {high_risk_count} requiring prompt medical evaluation."
            
        return summary
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for analysis."""
        from datetime import datetime
        return datetime.now().isoformat()