import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, CheckCircle, Sparkles, Activity, Brain, TrendingUp, Users } from 'lucide-react';
import FileUploader from './components/FileUploader';
import TestResults from './components/TestResults';
import TextAnalyzer from './components/TextAnalyzer';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import { Toaster } from 'react-hot-toast';

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
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Report
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'text'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analyze Text
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' ? (
              <FileUploader
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisStart={handleAnalysisStart}
                loading={loading}
              />
            ) : (
              <TextAnalyzer
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisStart={handleAnalysisStart}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Analysis Results
              </h2>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Analyze Another Report
              </button>
            </div>
            
            <TestResults result={analysisResult} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Analyzing your medical report...</span>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!analysisResult && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Easy to Understand
              </h3>
              <p className="text-gray-600 text-sm">
                Converts complex medical jargon into simple, patient-friendly explanations that anyone can understand.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Comprehensive Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Analyzes multiple test parameters including CBC, lipid profile, metabolic panel, and thyroid function tests.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600 text-sm">
                Your medical data is processed locally and not stored. Always includes proper medical disclaimers.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Built for SDG 3 (Good Health and Well-being) and SDG 10 (Reduced Inequalities)
            </p>
            <p>
              Making healthcare information accessible to everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;