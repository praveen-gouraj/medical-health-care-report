import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Heart, 
  Shield, 
  CheckCircle, 
  TrendingUp, 
  Brain, 
  Zap,
  Award,
  BarChart3,
  Activity,
  Users,
  Target,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import EnhancedFileUploader from './components/EnhancedFileUploader';
import HealthDashboard from './components/HealthDashboard';
import AdvancedAnalysisResults from './components/AdvancedAnalysisResults';
import TextAnalyzer from './components/TextAnalyzer';
import AIHealthChat from './components/AIHealthChat';
import HealthComparison from './components/HealthComparison';
import apiService from './services/apiService';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [aiStatus, setAiStatus] = useState({ gemini_available: false, enhanced_analyzer: true });
  const [userStats, setUserStats] = useState({
    totalAnalyses: 24,
    healthScore: 92,
    improvementStreak: 7,
    lastAnalysis: '2024-01-21',
    weeklyGoal: 3,
    currentWeekAnalyses: 2,
    monthlyProgress: 85,
    yearlyGoal: 156
  });

  useEffect(() => {
    // Load user preferences
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Load user stats
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    // Check AI status
    const checkAIStatus = async () => {
      try {
        const status = await apiService.checkAIStatus();
        setAiStatus(status);
      } catch (error) {
        console.warn('Could not check AI status:', error);
      }
    };
    
    checkAIStatus();
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
    
    // Update user stats
    if (result.success && result.analysis) {
      const newStats = {
        ...userStats,
        totalAnalyses: userStats.totalAnalyses + 1,
        healthScore: result.analysis.health_score || userStats.healthScore,
        improvementStreak: result.analysis.health_score > userStats.healthScore ? 
          userStats.improvementStreak + 1 : userStats.improvementStreak
      };
      setUserStats(newStats);
      localStorage.setItem('userStats', JSON.stringify(newStats));
    }
    
    // Show success toast
    toast.success('Analysis completed successfully!', {
      icon: '🎉',
      duration: 3000,
    });
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setAnalysisResult(null);
    toast.loading('Analyzing your medical report...', {
      id: 'analysis-loading'
    });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLoading(false);
    toast.dismiss('analysis-loading');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
          },
        }}
      />
      
      {/* Enhanced Header */}
      <header className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MedAI Simplifier
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered health insights for everyone
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              {/* Stats Display */}
              <motion.div 
                className="hidden md:flex items-center space-x-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg px-4 py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userStats.totalAnalyses} analyses
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userStats.healthScore}/100
                  </span>
                </div>
              </motion.div>
              
              {/* SDG Badge */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Target className="h-4 w-4" />
                <span>SDG 3 & 10</span>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!analysisResult && !loading && (
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Understand Your Health
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Instantly</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Transform complex medical reports into clear, actionable insights with our advanced AI technology.
              Get personalized health scores, risk assessments, and recommendations.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Brain, text: 'AI-Powered Analysis', color: 'from-blue-500 to-blue-600' },
                { icon: TrendingUp, text: 'Health Scoring', color: 'from-green-500 to-green-600' },
                { icon: Zap, text: 'Instant Results', color: 'from-yellow-500 to-orange-500' },
                { icon: Shield, text: 'Privacy First', color: 'from-purple-500 to-purple-600' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className={`flex items-center space-x-2 bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <feature.icon className="h-4 w-4" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="border-b border-gray-200/50 dark:border-gray-700/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Health Dashboard', icon: Activity },
                { id: 'upload', label: 'Upload Report', icon: Heart },
                { id: 'text', label: 'Analyze Text', icon: Brain },
                { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
                { id: 'comparison', label: 'Health Trends', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HealthDashboard userStats={userStats} />
                </motion.div>
              )}

              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnhancedFileUploader
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisStart={handleAnalysisStart}
                    loading={loading}
                  />
                </motion.div>
              )}
              
              {activeTab === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextAnalyzer
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisStart={handleAnalysisStart}
                    loading={loading}
                  />
                </motion.div>
              )}
              
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIHealthChat analysisResult={analysisResult} />
                </motion.div>
              )}

              {activeTab === 'comparison' && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HealthComparison userStats={userStats} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <span>Your Health Analysis</span>
                </h2>
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  New Analysis
                </button>
              </div>
              
              <AdvancedAnalysisResults result={analysisResult} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12"
            >
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Analyzing Your Health Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI is processing your medical report and generating personalized insights...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        {!analysisResult && !loading && (
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              {
                icon: Brain,
                title: 'Advanced AI Analysis',
                description: 'Our sophisticated AI understands complex medical terminology and provides accurate interpretations of your test results.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: TrendingUp,
                title: 'Health Score & Trends',
                description: 'Get a comprehensive health score and track your health trends over time with personalized insights.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Users,
                title: 'Accessible Healthcare',
                description: 'Breaking down barriers to healthcare understanding, making medical information accessible to everyone.',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`bg-gradient-to-r ${feature.gradient} rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Built for Global Health Impact
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Supporting UN Sustainable Development Goals 3 (Good Health and Well-being) and 10 (Reduced Inequalities)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Making healthcare information accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;