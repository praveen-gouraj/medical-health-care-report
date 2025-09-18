import React, { useState } from 'react';
import { MessageSquare, AlertCircle, Send } from 'lucide-react';
import apiService from '../services/apiService';

const TextAnalyzer = ({ onAnalysisComplete, onAnalysisStart, loading }) => {
  const [text, setText] = useState('');
  const [gender, setGender] = useState('general');
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some medical test data to analyze');
      return;
    }

    setError(null);
    onAnalysisStart();

    try {
      // Use smart analysis with patient info
      const patientInfo = { gender: gender };
      const result = await apiService.smartAnalyze(text.trim(), patientInfo, true);

      if (result.ai_analysis || result.analysis || result.enhanced_analysis) {
        onAnalysisComplete({
          success: true,
          ...result,
          original_text: text.trim()
        });
      } else {
        setError('Failed to analyze the text');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to analyze the text';
      setError(errorMessage);
      onAnalysisComplete(null);
    }
  };

  const loadSampleData = () => {
    const sampleText = `COMPLETE BLOOD COUNT
    
Hemoglobin: 8.5 g/dL (Normal: 12.0-16.0)
Hematocrit: 25.2% (Normal: 36.0-46.0)
White Blood Cell Count: 12.5 ×10³/μL (Normal: 4.5-11.0)
Platelet Count: 180 ×10³/μL (Normal: 150-450)

LIPID PROFILE

Total Cholesterol: 250 mg/dL (Normal: <200)
LDL Cholesterol: 160 mg/dL (Normal: <100)
HDL Cholesterol: 35 mg/dL (Normal: >40)
Triglycerides: 200 mg/dL (Normal: <150)

BASIC METABOLIC PANEL

Glucose: 150 mg/dL (Normal: 70-100)
Creatinine: 1.8 mg/dL (Normal: 0.6-1.2)
Sodium: 135 mEq/L (Normal: 136-145)
Potassium: 3.2 mEq/L (Normal: 3.5-5.0)`;

    setText(sampleText);
  };

  return (
    <div className="space-y-6">
      {/* Gender Selection */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Gender (for accurate reference ranges):
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="general">General</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Text Input Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Medical Test Results
        </label>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your medical test results here...

Example:
Hemoglobin: 8.5 g/dL
Total Cholesterol: 250 mg/dL
Glucose: 150 mg/dL
..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />
          <div className="absolute top-3 right-3">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Copy and paste test results from your medical report, including test names, values, and reference ranges if available.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={loadSampleData}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Load Sample Data
        </button>
        
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Analyze Text</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Analysis Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to use:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Copy test results from your medical report</li>
          <li>• Include test names, values, and units (e.g., "Hemoglobin: 8.5 g/dL")</li>
          <li>• Reference ranges are helpful but not required</li>
          <li>• Click "Load Sample Data" to see an example</li>
        </ul>
      </div>
    </div>
  );
};

export default TextAnalyzer;