import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Award,
  Brain,
  Heart,
  Activity,
  Target,
  Lightbulb,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar
} from 'recharts';

const AdvancedAnalysisResults = ({ result }) => {
  const [activeView, setActiveView] = useState('overview');
  
  if (!result?.analysis) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">No analysis results available</p>
      </div>
    );
  }

  const { analysis } = result;
  const { results = [], health_score = 0, insights = [], recommendations = {} } = analysis;

  // Prepare data for charts
  const categoryData = {};
  const riskData = [];
  const statusDistribution = { normal: 0, high: 0, low: 0 };

  results.forEach((item) => {
    const category = item.category || 'General';
    if (!categoryData[category]) {
      categoryData[category] = { count: 0, abnormal: 0, totalRisk: 0 };
    }
    categoryData[category].count++;
    categoryData[category].totalRisk += item.risk_score || 0;
    
    if (item.status !== 'normal') {
      categoryData[category].abnormal++;
    }

    statusDistribution[item.status] = (statusDistribution[item.status] || 0) + 1;

    riskData.push({
      name: item.name,
      risk: item.risk_score || 0,
      category: category
    });
  });

  const pieData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: status === 'normal' ? '#10B981' : status === 'high' ? '#EF4444' : '#F59E0B'
  }));

  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    category: category.replace(/\s+/g, '\n'),
    avgRisk: data.totalRisk / data.count,
    abnormalCount: data.abnormal,
    totalCount: data.count
  }));

  const healthScoreData = [
    { name: 'Health Score', value: health_score, fill: getHealthScoreColor(health_score) }
  ];

  function getHealthScoreColor(score) {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#F59E0B';
    if (score >= 60) return '#EF4444';
    return '#DC2626';
  }

  function getRiskColor(risk) {
    if (risk <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (risk <= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (risk <= 7) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }

  function getStatusIcon(status, riskScore) {
    if (status === 'normal') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (riskScore > 6) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    return <Info className="h-5 w-5 text-yellow-600" />;
  }

  return (
    <div className="space-y-8">
      {/* Health Score Overview */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Your Health Score</h2>
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-bold">{health_score}</span>
              <span className="text-2xl opacity-75">/100</span>
            </div>
            <div className="text-lg opacity-90">
              Grade: {analysis.health_grade || 'N/A'}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={healthScoreData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill={getHealthScoreColor(health_score)} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>{results.length} Parameters Analyzed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>{results.filter(r => r.status === 'normal').length} Within Normal Range</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Confidence: High</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'details', label: 'Detailed Results', icon: Activity },
          { id: 'insights', label: 'Insights', icon: Lightbulb },
          { id: 'recommendations', label: 'Recommendations', icon: Heart }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeView === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Status Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Test Results Distribution</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Risk Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Risk by Category</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgRisk' ? `${value.toFixed(1)} Risk Score` : value,
                        name === 'avgRisk' ? 'Average Risk' : 'Abnormal Tests'
                      ]}
                    />
                    <Bar dataKey="avgRisk" fill="#8884d8" name="Average Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid md:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Tests',
                  value: results.length,
                  icon: Activity,
                  color: 'blue',
                  trend: null
                },
                {
                  title: 'Normal Results',
                  value: results.filter(r => r.status === 'normal').length,
                  icon: CheckCircle,
                  color: 'green',
                  trend: 'up'
                },
                {
                  title: 'Need Attention',
                  value: results.filter(r => r.status !== 'normal').length,
                  icon: AlertTriangle,
                  color: 'yellow',
                  trend: 'down'
                },
                {
                  title: 'High Risk',
                  value: results.filter(r => (r.risk_score || 0) > 6).length,
                  icon: TrendingUp,
                  color: 'red',
                  trend: 'down'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                  {stat.trend && (
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        {stat.trend === 'up' ? 'Good' : 'Monitor'}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Results Tab */}
        {activeView === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {results.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status, item.risk_score)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk_score || 0)}`}>
                      Risk: {item.risk_score || 0}/10
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'normal' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Your Value:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.value} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Normal Range:</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {typeof item.normal_range === 'object' 
                            ? `${item.normal_range.min}-${item.normal_range.max} ${item.normal_range.unit || item.unit}`
                            : item.normal_range
                          }
                        </span>
                      </div>
                      {item.percentage_deviation && Math.abs(item.percentage_deviation) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Deviation:</span>
                          <span className={`text-sm font-medium ${
                            item.percentage_deviation > 0 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {item.percentage_deviation > 0 ? '+' : ''}{item.percentage_deviation.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Explanation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.explanation}
                      </p>
                    </div>
                    
                    {item.lifestyle_tips && item.lifestyle_tips.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Tips</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {item.lifestyle_tips.slice(0, 2).map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2">
                              <span className="text-blue-600">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Insights Tab */}
        {activeView === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-600 rounded-lg p-3">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Health Insights
                </h2>
              </div>
              
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-gray-800 dark:text-gray-200">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {analysis.summary && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>Summary</span>
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Recommendations Tab */}
        {activeView === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {Object.entries(recommendations).map(([category, items]) => (
              items.length > 0 && (
                <motion.div
                  key={category}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>{category.replace('_', ' ')} Recommendations</span>
                  </h3>
                  <div className="grid gap-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
          <Download className="h-4 w-4" />
          <span>Download Report</span>
        </button>
        <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg">
          <Share2 className="h-4 w-4" />
          <span>Share Results</span>
        </button>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalysisResults;