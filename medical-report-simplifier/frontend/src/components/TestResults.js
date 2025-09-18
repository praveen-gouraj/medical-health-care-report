import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';

const TestResults = ({ result }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showFriendlyView, setShowFriendlyView] = useState(true);

  if (!result || !result.analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">No analysis results available.</p>
      </div>
    );
  }

  const { analysis } = result;
  const { analyzed_results, summary, overall_assessment, friendly_explanations, disclaimers } = analysis;

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getStatusIcon = (status, severity) => {
    if (status === 'normal') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (severity === 'high') {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusClass = (status, severity) => {
    if (status === 'normal') {
      return 'bg-green-50 text-green-700 border-green-200';
    } else if (severity === 'high') {
      return 'bg-red-50 text-red-700 border-red-200';
    } else {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getTrendIcon = (status) => {
    if (status === 'high') return <TrendingUp className="h-4 w-4" />;
    if (status === 'low') return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  // Group results by category
  const resultsByCategory = analyzed_results.reduce((acc, result) => {
    const category = result.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Assessment</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFriendlyView(!showFriendlyView)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showFriendlyView ? 'Show Detailed View' : 'Show Simple View'}
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-gray-800">{overall_assessment}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.total_tests}</p>
            <p className="text-sm text-gray-600">Total Tests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.normal_count}</p>
            <p className="text-sm text-gray-600">Normal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.abnormal_count}</p>
            <p className="text-sm text-gray-600">Abnormal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{summary.high_severity_count}</p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      {showFriendlyView ? (
        /* Friendly Explanations View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Simple Explanations
          </h3>
          <div className="space-y-4">
            {friendly_explanations && friendly_explanations.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${getStatusClass(item.status, item.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(item.status, item.severity)}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{item.friendly_explanation}</div>
                  </div>
                  {getTrendIcon(item.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Results View */
        <div className="space-y-4">
          {Object.entries(resultsByCategory).map(([category, results]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {results.length} tests
                  </span>
                </div>
                {expandedCategories[category] ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedCategories[category] && (
                <div className="px-6 pb-6 space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status, result.severity)}
                          <div>
                            <h4 className="font-medium text-gray-900">{result.test_name}</h4>
                            <p className="text-sm text-gray-600">
                              {result.value} {result.unit}
                              {result.normal_range && (
                                <span className="ml-2">
                                  (Normal: {result.normal_range})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(result.status, result.severity)}`}>
                          {result.status}
                        </span>
                      </div>

                      {result.explanation && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{result.explanation}</p>
                        </div>
                      )}

                      {result.recommendations && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700">{result.recommendations}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimers */}
      {disclaimers && disclaimers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-amber-900 mb-2">Important Disclaimers:</h3>
          <ul className="text-xs text-amber-800 space-y-1">
            {disclaimers.map((disclaimer, index) => (
              <li key={index}>• {disclaimer}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Demo Notice */}
      {result.demo && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-purple-800 font-medium">
              This is a demo analysis with sample data for demonstration purposes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;