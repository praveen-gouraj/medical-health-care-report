// Enhanced API service with Gemini AI integration
class EnhancedAPIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  async checkAIStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/ai-status`);
      return await response.json();
    } catch (error) {
      console.error('Error checking AI status:', error);
      return { gemini_available: false, enhanced_analyzer: true };
    }
  }

  async analyzeWithAI(text, patientInfo = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/ai-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          patient_info: patientInfo
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in AI analysis:', error);
      throw error;
    }
  }

  async explainParameter(parameterName, value, context = '') {
    try {
      const response = await fetch(`${this.baseURL}/api/ai-explain/${parameterName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: value,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error explaining parameter:', error);
      throw error;
    }
  }

  async uploadFile(file, patientInfo = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add patient info to form data
      Object.keys(patientInfo).forEach(key => {
        if (patientInfo[key]) {
          formData.append(key, patientInfo[key]);
        }
      });

      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async analyzeText(text, patientInfo = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          patient_info: patientInfo
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }

  async getEnhancedAnalysis(text, patientInfo = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/enhanced-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          patient_info: patientInfo
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in enhanced analysis:', error);
      throw error;
    }
  }

  async getHealthInsights(text, patientInfo = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/health-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          patient_info: patientInfo
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting health insights:', error);
      throw error;
    }
  }

  async getDemoAnalysis() {
    try {
      const response = await fetch(`${this.baseURL}/api/demo-analysis`);
      return await response.json();
    } catch (error) {
      console.error('Error getting demo analysis:', error);
      throw error;
    }
  }

  // Smart analysis that chooses the best available method
  async smartAnalyze(text, patientInfo = {}, preferAI = true) {
    try {
      // Check AI status first
      const aiStatus = await this.checkAIStatus();
      
      if (preferAI && aiStatus.gemini_available) {
        // Try Gemini AI first
        try {
          const aiResult = await this.analyzeWithAI(text, patientInfo);
          return {
            ...aiResult,
            analysis_method: 'gemini_ai',
            ai_powered: true
          };
        } catch (aiError) {
          console.warn('Gemini AI failed, falling back to enhanced analysis:', aiError);
        }
      }
      
      // Fallback to enhanced analysis
      try {
        const enhancedResult = await this.getEnhancedAnalysis(text, patientInfo);
        return {
          ...enhancedResult,
          analysis_method: 'enhanced_rule_based',
          ai_powered: false
        };
      } catch (enhancedError) {
        console.warn('Enhanced analysis failed, falling back to basic analysis:', enhancedError);
      }
      
      // Final fallback to basic analysis
      const basicResult = await this.analyzeText(text, patientInfo);
      return {
        ...basicResult,
        analysis_method: 'basic_rule_based',
        ai_powered: false
      };
      
    } catch (error) {
      console.error('All analysis methods failed:', error);
      throw new Error('Analysis service temporarily unavailable. Please try again later.');
    }
  }
}

// Create and export a singleton instance
const apiService = new EnhancedAPIService();
export default apiService;