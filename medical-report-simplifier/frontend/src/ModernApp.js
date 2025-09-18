import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, CheckCircle, Sparkles, Activity, Brain, TrendingUp, Users } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import FileUploader from './components/FileUploader';
import TestResults from './components/TestResults';
import TextAnalyzer from './components/TextAnalyzer';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    // Check system preference for dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
    // Calculate health score from analysis
    if (result?.analysis?.health_score) {
      setHealthScore(result.analysis.health_score);
    }
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const tabs = [
    { id: 'dashboard', label: 'Health Dashboard', icon: Activity, color: 'from-blue-500 to-cyan-500' },
    { id: 'upload', label: 'Upload Report', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'text', label: 'Analyze Text', icon: Brain, color: 'from-purple-500 to-indigo-500' },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
    { id: 'trends', label: 'Health Trends', icon: TrendingUp, color: 'from-orange-500 to-amber-500' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'backdrop-blur-lg bg-white/20 border border-white/30',
          duration: 4000,
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full ${
            darkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'
          } blur-3xl`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full ${
            darkMode ? 'bg-pink-500/10' : 'bg-purple-500/10'
          } blur-3xl`}
        />
      </div>

      {/* Header with Glassmorphism */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`backdrop-blur-xl border-b ${
          darkMode 
            ? 'bg-gray-900/30 border-gray-700/50' 
            : 'bg-white/20 border-white/30'
        } shadow-2xl sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className={`p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Medical Report Simplifier
                </motion.h1>
                <motion.p 
                  className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  AI-powered healthcare accessibility platform
                </motion.p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-6">
              {/* Health Score Display */}
              <motion.div 
                className={`flex items-center space-x-3 px-4 py-2 rounded-full backdrop-blur-lg ${
                  darkMode ? 'bg-gray-800/40' : 'bg-white/40'
                } border border-white/20 shadow-lg`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <svg className="w-8 h-8" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                      strokeWidth="2"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#healthGradient)"
                      strokeWidth="2"
                      strokeDasharray={`${healthScore}, 100`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${healthScore}, 100` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="healthGradient">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {healthScore}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Health Score
                </span>
              </motion.div>

              {/* SDG Impact */}
              <motion.div 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-lg ${
                  darkMode ? 'bg-green-900/40' : 'bg-green-100/60'
                } border border-green-500/20 shadow-lg`}
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">SDG 3 & 10</span>
                <Users className="h-4 w-4 text-green-600" />
              </motion.div>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl backdrop-blur-lg ${
                  darkMode ? 'bg-yellow-500/20' : 'bg-gray-800/20'
                } border border-white/20 shadow-lg hover:scale-110 transition-all duration-300`}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    ☀️
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    🌙
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Enhanced Tab Navigation with Glassmorphism */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`backdrop-blur-xl rounded-3xl shadow-2xl border mb-8 overflow-hidden ${
            darkMode 
              ? 'bg-gray-900/30 border-gray-700/50' 
              : 'bg-white/30 border-white/50'
          }`}
        >
          <div className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-white/30'}`}>
            <nav className="flex overflow-x-auto scrollbar-hide p-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap mr-2 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                        : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/30' : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'}`
                    }`}
                    whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    healthScore={healthScore}
                    analysisResult={analysisResult}
                    darkMode={darkMode}
                  />
                )}
                {activeTab === 'upload' && (
                  <FileUploader
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisStart={handleAnalysisStart}
                    loading={loading}
                    darkMode={darkMode}
                  />
                )}
                {activeTab === 'text' && (
                  <TextAnalyzer
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisStart={handleAnalysisStart}
                    loading={loading}
                    darkMode={darkMode}
                  />
                )}
                {activeTab === 'assistant' && (
                  <AIAssistant
                    analysisResult={analysisResult}
                    darkMode={darkMode}
                  />
                )}
                {activeTab === 'trends' && (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Health Trends</h3>
                    <p>Track your health progress over time (Coming Soon)</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Results Display */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <TestResults 
                result={analysisResult} 
                onReset={handleReset}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                className={`p-8 rounded-3xl backdrop-blur-xl ${
                  darkMode ? 'bg-gray-900/80' : 'bg-white/80'
                } border border-white/20 shadow-2xl text-center`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.h3
                  className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Analyzing Report
                </motion.h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI is processing your medical data...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section for First Visit */}
        {!analysisResult && !loading && activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            {[
              {
                icon: Heart,
                title: "Easy to Understand",
                description: "Converts complex medical jargon into simple, patient-friendly explanations",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: CheckCircle,
                title: "Comprehensive Analysis", 
                description: "Analyzes multiple test parameters with AI-powered insights",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "Your medical data is processed securely with privacy protection",
                color: "from-blue-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`backdrop-blur-xl rounded-2xl p-6 ${
                  darkMode ? 'bg-gray-900/30' : 'bg-white/30'
                } border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`backdrop-blur-xl border-t mt-16 ${
          darkMode 
            ? 'bg-gray-900/30 border-gray-700/50' 
            : 'bg-white/20 border-white/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">🏥 Built for Healthcare</span> • 
              <span className="font-medium"> 🌍 Designed for Global Impact</span> • 
              <span className="font-medium"> 🏆 Ready to Win Hackathons</span>
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI Status: Operational
                </span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="h-4 w-4 text-red-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Making healthcare accessible
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;