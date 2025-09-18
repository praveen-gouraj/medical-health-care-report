import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Calendar,
  Target,
  Activity,
  Heart,
  Brain,
  Zap,
  Users,
  Globe,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const HealthDashboard = ({ userStats }) => {
  const [healthTrend, setHealthTrend] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [globalImpact, setGlobalImpact] = useState({
    totalUsers: 15420,
    reportsAnalyzed: 48392,
    healthImprovement: 87,
    sdgContribution: 92
  });

  useEffect(() => {
    // Simulate health trend data
    const trendData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date: date.toISOString().split('T')[0],
        healthScore: Math.max(50, userStats.healthScore + Math.random() * 20 - 10),
        riskLevel: Math.max(0, Math.random() * 10)
      });
    }
    setHealthTrend(trendData);

    // Generate achievements based on user stats
    const userAchievements = [
      {
        id: 1,
        title: 'Health Explorer',
        description: 'Completed your first health analysis',
        icon: '🔍',
        earned: userStats.totalAnalyses > 0,
        date: '2024-01-15'
      },
      {
        id: 2,
        title: 'Trend Tracker',
        description: 'Analyzed 5 reports to track health trends',
        icon: '📈',
        earned: userStats.totalAnalyses >= 5,
        progress: Math.min(100, (userStats.totalAnalyses / 5) * 100)
      },
      {
        id: 3,
        title: 'Health Champion',
        description: 'Maintained excellent health score',
        icon: '🏆',
        earned: userStats.healthScore >= 90,
        progress: Math.min(100, (userStats.healthScore / 90) * 100)
      },
      {
        id: 4,
        title: 'Improvement Streak',
        description: 'Showed consistent health improvements',
        icon: '🔥',
        earned: userStats.improvementStreak >= 3,
        progress: Math.min(100, (userStats.improvementStreak / 3) * 100)
      },
      {
        id: 5,
        title: 'SDG Contributor',
        description: 'Contributing to global health equity',
        icon: '🌍',
        earned: userStats.totalAnalyses > 0,
        date: '2024-01-15'
      }
    ];
    setAchievements(userAchievements);
  }, [userStats]);

  const getDashboardGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getHealthScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getDashboardGreeting()}! 👋
            </h1>
            <p className="text-xl opacity-90">
              Here's your health journey overview
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{userStats.healthScore || 0}</div>
            <div className="text-lg opacity-75">Health Score</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        className="grid md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          {
            title: 'Total Analyses',
            value: userStats.totalAnalyses || 0,
            icon: BarChart3,
            color: 'blue',
            description: 'Reports analyzed'
          },
          {
            title: 'Health Score',
            value: userStats.healthScore || 0,
            icon: Heart,
            color: 'red',
            description: getHealthScoreGrade(userStats.healthScore || 0).grade,
            badge: true
          },
          {
            title: 'Improvement Streak',
            value: userStats.improvementStreak || 0,
            icon: TrendingUp,
            color: 'green',
            description: 'consecutive improvements'
          },
          {
            title: 'Achievements',
            value: achievements.filter(a => a.earned).length,
            icon: Award,
            color: 'yellow',
            description: `of ${achievements.length} unlocked`
          }
        ].map((stat, index) => {
          const gradeInfo = stat.badge ? getHealthScoreGrade(stat.value) : null;
          return (
            <motion.div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                {gradeInfo && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${gradeInfo.bg} ${gradeInfo.color}`}>
                    {gradeInfo.grade}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stat.description}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Health Trend Chart */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span>Health Trends (Last 30 Days)</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Health Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthTrend}>
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
                  name === 'healthScore' ? 'Health Score' : 'Risk Level'
                ]}
              />
              <Area
                type="monotone"
                dataKey="healthScore"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="riskLevel"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <Award className="h-6 w-6 text-yellow-600" />
          <span>Your Achievements</span>
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all ${
                achievement.earned
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    achievement.earned 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    achievement.earned 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.earned ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Sparkles className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs text-yellow-700 dark:text-yellow-400">
                        Unlocked {achievement.date}
                      </span>
                    </div>
                  ) : achievement.progress !== undefined ? (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-500">{Math.round(achievement.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Global Impact Section */}
      <motion.div
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Global Health Impact (SDG 3 & 10)
          </h3>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {globalImpact.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Global Users Empowered
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {globalImpact.reportsAnalyzed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Reports Analyzed Worldwide
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {globalImpact.healthImprovement}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Users Report Health Improvement
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {globalImpact.sdgContribution}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              SDG Target Achievement
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg">
          <p className="text-center text-gray-700 dark:text-gray-300">
            🌍 Your participation contributes to UN SDG 3 (Good Health) and SDG 10 (Reduced Inequalities) 
            by making healthcare information accessible to everyone, everywhere.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthDashboard;