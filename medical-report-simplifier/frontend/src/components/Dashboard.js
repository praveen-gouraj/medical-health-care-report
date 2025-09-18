import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Award, 
  Target, 
  Users,
  Shield,
  Zap,
  Globe,
  Calendar
} from 'lucide-react';

const Dashboard = ({ healthScore = 85, analysisResult, darkMode }) => {
  const achievements = [
    { id: 1, title: "Health Explorer", description: "First health analysis completed", icon: "🔍", unlocked: true },
    { id: 2, title: "Data Insight", description: "Analyzed 5 health reports", icon: "📊", unlocked: true },
    { id: 3, title: "Wellness Warrior", description: "Maintained good health score", icon: "⚡", unlocked: healthScore > 80 },
    { id: 4, title: "Health Champion", description: "Perfect health score achieved", icon: "🏆", unlocked: healthScore >= 95 }
  ];

  const healthGrade = healthScore >= 90 ? 'A+' : healthScore >= 80 ? 'A' : healthScore >= 70 ? 'B' : healthScore >= 60 ? 'C' : 'D';
  const gradeColor = healthScore >= 90 ? 'from-green-500 to-emerald-500' : 
                     healthScore >= 80 ? 'from-blue-500 to-cyan-500' :
                     healthScore >= 70 ? 'from-yellow-500 to-orange-500' : 
                     'from-red-500 to-pink-500';

  const stats = [
    { label: "Reports Analyzed", value: "12", icon: Activity, color: "from-blue-500 to-cyan-500" },
    { label: "Health Score", value: healthScore, icon: Heart, color: gradeColor },
    { label: "Improvement", value: "+15%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { label: "Global Impact", value: "2.8B", icon: Users, color: "from-purple-500 to-indigo-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h2 
          className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Your Health Dashboard
        </motion.h2>
        <motion.p 
          className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your personal AI-powered health analytics platform
        </motion.p>
      </motion.div>

      {/* Health Score Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`backdrop-blur-xl rounded-3xl p-8 text-center ${
          darkMode ? 'bg-gray-800/30' : 'bg-white/40'
        } border border-white/20 shadow-2xl`}
      >
        <div className="flex items-center justify-center space-x-8">
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
                strokeWidth="1.5"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#healthGradientDash)"
                strokeWidth="1.5"
                strokeDasharray={`${healthScore}, 100`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${healthScore}, 100` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="healthGradientDash">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  {healthScore}
                </motion.div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Health Score
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-left">
            <motion.div 
              className={`text-6xl font-bold bg-gradient-to-r ${gradeColor} bg-clip-text text-transparent mb-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            >
              {healthGrade}
            </motion.div>
            <motion.p 
              className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              Excellent Health Status
            </motion.p>
            <motion.p 
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
            >
              Keep up the great work! 🎉
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className={`backdrop-blur-xl rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800/30' : 'bg-white/40'
            } border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300`}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <motion.div 
                  className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SDG Impact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className={`backdrop-blur-xl rounded-3xl p-8 ${
          darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30' : 'bg-gradient-to-r from-green-100/50 to-blue-100/50'
        } border border-white/20 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Global Health Impact
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Contributing to UN Sustainable Development Goals
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-12 w-12 text-blue-500" />
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-green-900/20' : 'bg-green-50/80'} border border-green-500/20`}>
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-green-700">SDG 3: Good Health</span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Making medical information accessible to 2.8 billion people with limited health literacy
            </p>
          </div>
          
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50/80'} border border-blue-500/20`}>
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-blue-700">SDG 10: Reduced Inequalities</span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Breaking down healthcare communication barriers worldwide
            </p>
          </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className={`backdrop-blur-xl rounded-3xl p-8 ${
          darkMode ? 'bg-gray-800/30' : 'bg-white/40'
        } border border-white/20 shadow-2xl`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Award className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Achievements
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                achievement.unlocked 
                  ? `${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-50 to-pink-50'} shadow-lg` 
                  : `${darkMode ? 'bg-gray-700/20' : 'bg-gray-100/50'} opacity-50`
              }`}
              whileHover={achievement.unlocked ? { scale: 1.02 } : {}}
            >
              <motion.div 
                className="text-3xl"
                animate={achievement.unlocked ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {achievement.icon}
              </motion.div>
              <div>
                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {achievement.title}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                  className="ml-auto"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Upload New Report",
            description: "Analyze your latest medical test results",
            icon: Target,
            color: "from-pink-500 to-rose-500",
            action: "upload"
          },
          {
            title: "AI Health Assistant",
            description: "Get personalized health insights",
            icon: Zap,
            color: "from-green-500 to-emerald-500",
            action: "assistant"
          },
          {
            title: "View Trends",
            description: "Track your health progress over time",
            icon: Calendar,
            color: "from-orange-500 to-amber-500",
            action: "trends"
          }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            className={`backdrop-blur-xl rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800/30' : 'bg-white/40'
            } border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
          >
            <motion.div 
              className={`p-3 rounded-xl bg-gradient-to-r ${action.color} w-fit mb-4`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <action.icon className="h-6 w-6 text-white" />
            </motion.div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {action.title}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {action.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;