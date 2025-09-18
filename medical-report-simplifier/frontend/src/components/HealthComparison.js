import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Target,
  Award,
  ArrowRight,
  Plus,
  Download,
  Share2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';

const HealthComparison = ({ userStats }) => {
  const [comparisons, setComparisons] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedMetrics, setSelectedMetrics] = useState(['healthScore', 'riskLevel', 'cholesterol', 'bloodPressure']);

  useEffect(() => {
    // Generate mock historical data for demonstration
    const generateHistoricalData = () => {
      const timeframes = {
        '3months': 90,
        '6months': 180,
        '1year': 365
      };
      
      const days = timeframes[selectedTimeframe] || 180;
      const data = [];
      
      for (let i = days; i >= 0; i -= 7) { // Weekly data points
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          healthScore: Math.max(40, Math.min(100, 65 + Math.random() * 30 + (days - i) * 0.05)),
          riskLevel: Math.max(0, Math.min(10, 6 - (days - i) * 0.01 + Math.random() * 2)),
          cholesterol: Math.max(150, Math.min(300, 200 + Math.random() * 40 - (days - i) * 0.02)),
          bloodPressure: Math.max(90, Math.min(160, 130 + Math.random() * 20 - (days - i) * 0.01)),
          weight: Math.max(50, Math.min(100, 70 + Math.random() * 10 - (days - i) * 0.005)),
          glucose: Math.max(70, Math.min(140, 95 + Math.random() * 20)),
          hemoglobin: Math.max(10, Math.min(18, 13.5 + Math.random() * 2))
        });
      }
      
      return data;
    };
    
    setComparisons(generateHistoricalData());
  }, [selectedTimeframe]);

  const getMetricInfo = (metric) => {
    const metricData = {
      healthScore: {
        name: 'Health Score',
        unit: '/100',
        color: '#3B82F6',
        target: 85,
        description: 'Overall health assessment'
      },
      riskLevel: {
        name: 'Risk Level',
        unit: '/10',
        color: '#EF4444',
        target: 3,
        description: 'Health risk assessment',
        inverse: true
      },
      cholesterol: {
        name: 'Cholesterol',
        unit: 'mg/dL',
        color: '#8B5CF6',
        target: 200,
        description: 'Total cholesterol level'
      },
      bloodPressure: {
        name: 'Blood Pressure',
        unit: 'mmHg',
        color: '#F59E0B',
        target: 120,
        description: 'Systolic blood pressure'
      },
      weight: {
        name: 'Weight',
        unit: 'kg',
        color: '#10B981',
        target: 70,
        description: 'Body weight'
      },
      glucose: {
        name: 'Blood Glucose',
        unit: 'mg/dL',
        color: '#EC4899',
        target: 100,
        description: 'Fasting blood glucose'
      },
      hemoglobin: {
        name: 'Hemoglobin',
        unit: 'g/dL',
        color: '#06B6D4',
        target: 14,
        description: 'Hemoglobin level'
      }
    };
    
    return metricData[metric] || {};
  };

  const calculateTrend = (data, metric) => {
    if (data.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = data.slice(-4).map(d => d[metric]);
    const earlier = data.slice(-8, -4).map(d => d[metric]);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    const metricInfo = getMetricInfo(metric);
    
    let trend = 'stable';
    if (Math.abs(change) > 2) {
      if (metricInfo.inverse) {
        trend = change < 0 ? 'improving' : 'declining';
      } else {
        trend = change > 0 ? 'improving' : 'declining';
      }
    }
    
    return { trend, change: Math.abs(change) };
  };

  const generateInsights = () => {
    const insights = [];
    
    selectedMetrics.forEach(metric => {
      const trend = calculateTrend(comparisons, metric);
      const metricInfo = getMetricInfo(metric);
      
      if (trend.trend === 'improving') {
        insights.push({
          type: 'positive',
          title: `${metricInfo.name} Improving`,
          description: `Your ${metricInfo.name.toLowerCase()} has improved by ${trend.change.toFixed(1)}% over the selected period.`,
          icon: TrendingUp,
          color: 'text-green-600'
        });
      } else if (trend.trend === 'declining') {
        insights.push({
          type: 'warning',
          title: `${metricInfo.name} Needs Attention`,
          description: `Your ${metricInfo.name.toLowerCase()} has changed by ${trend.change.toFixed(1)}% and may need attention.`,
          icon: TrendingDown,
          color: 'text-orange-600'
        });
      }
    });
    
    return insights;
  };

  const exportData = () => {
    const csvContent = [
      ['Date', ...selectedMetrics.map(m => getMetricInfo(m).name)],
      ...comparisons.map(row => [
        row.date,
        ...selectedMetrics.map(metric => row[metric])
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_trends_${selectedTimeframe}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Health Trends & Comparison</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your health journey and identify improvement opportunities
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <button
            onClick={exportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Selection */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Metrics to Compare</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(getMetricInfo('healthScore')).length > 0 && 
            ['healthScore', 'riskLevel', 'cholesterol', 'bloodPressure', 'weight', 'glucose', 'hemoglobin'].map(metric => {
              const info = getMetricInfo(metric);
              return (
                <label
                  key={metric}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMetrics.includes(metric)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric]);
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                      }
                    }}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {info.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {info.unit}
                    </div>
                  </div>
                </label>
              );
            })
          }
        </div>
      </motion.div>

      {/* Trend Chart */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Health Trends Over Time</h3>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparisons}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  value.toFixed(1),
                  getMetricInfo(name).name + ' ' + getMetricInfo(name).unit
                ]}
              />
              
              {selectedMetrics.map((metric, index) => {
                const info = getMetricInfo(metric);
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={info.color}
                    strokeWidth={2}
                    dot={{ fill: info.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Key Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Key Insights</span>
          </h3>
          
          <div className="space-y-4">
            {generateInsights().map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
            
            {generateInsights().length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add more data points to see detailed insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Progress Summary</span>
          </h3>
          
          <div className="space-y-4">
            {selectedMetrics.slice(0, 4).map(metric => {
              const info = getMetricInfo(metric);
              const trend = calculateTrend(comparisons, metric);
              const latest = comparisons[comparisons.length - 1]?.[metric] || 0;
              
              return (
                <div key={metric} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {info.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Current: {latest.toFixed(1)} {info.unit}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {trend.trend === 'improving' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : trend.trend === 'declining' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                    )}
                    <span className={`text-sm font-medium ${
                      trend.trend === 'improving' ? 'text-green-600' :
                      trend.trend === 'declining' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {trend.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthComparison;