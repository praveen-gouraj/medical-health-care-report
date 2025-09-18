import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Heart, 
  Brain, 
  Shield,
  Zap,
  MessageCircle,
  Clock,
  Star,
  ChevronDown
} from 'lucide-react';

const AIAssistant = ({ darkMode }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Health Assistant. I can help you understand your medical reports, answer health questions, and provide personalized insights. What would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', name: 'General Health', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'symptoms', name: 'Symptoms', icon: Shield, color: 'from-blue-500 to-cyan-500' },
    { id: 'medications', name: 'Medications', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { id: 'lifestyle', name: 'Lifestyle', icon: Brain, color: 'from-purple-500 to-indigo-500' }
  ];

  const quickQuestions = [
    "What does my blood test results mean?",
    "How can I improve my health score?",
    "Are there any concerning values in my report?",
    "What lifestyle changes do you recommend?",
    "Explain my cholesterol levels",
    "How often should I get health checkups?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateAIResponse(inputMessage, selectedCategory),
        timestamp: new Date().toLocaleTimeString(),
        category: selectedCategory
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (question, category) => {
    const responses = {
      general: [
        "Based on your health data, I can see you're maintaining good overall health. Your key metrics are within normal ranges, which is excellent!",
        "Your current health score indicates you're on the right track. I'd recommend continuing your current lifestyle habits while monitoring key indicators.",
        "Looking at your health trends, you've shown consistent improvement. Keep focusing on balanced nutrition and regular exercise."
      ],
      symptoms: [
        "For symptom analysis, I recommend discussing any persistent symptoms with your healthcare provider. I can help you track patterns and prepare questions for your doctor.",
        "Based on common health patterns, many symptoms can be related to stress, diet, or sleep. Let's explore these factors in your case.",
        "Symptom tracking is crucial for understanding your health. I can help you identify patterns and when to seek professional medical advice."
      ],
      medications: [
        "Medication management is important for optimal health outcomes. I can help you understand timing, interactions, and track your medication schedule.",
        "Based on your health profile, it's essential to follow prescribed medication schedules. I can provide reminders and interaction checks.",
        "For medication questions, always consult your healthcare provider. I can help you prepare questions and track your medication effects."
      ],
      lifestyle: [
        "Lifestyle factors significantly impact your health score. Based on your data, focusing on sleep quality and stress management could provide the biggest benefits.",
        "Your health journey shows great potential for improvement through lifestyle modifications. I recommend starting with one area at a time.",
        "Data shows that small, consistent lifestyle changes lead to the best long-term health outcomes. Let's identify your priority areas."
      ]
    };

    const categoryResponses = responses[category] || responses.general;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl rounded-2xl p-6 mb-6 ${
          darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-100/50 to-pink-100/50'
        } border border-white/20 shadow-lg`}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.4)",
                "0 0 40px rgba(236, 72, 153, 0.4)",
                "0 0 20px rgba(168, 85, 247, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Health Assistant
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your personal health intelligence companion
            </p>
          </div>
          <motion.div
            className="ml-auto flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI Powered
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : `${darkMode ? 'bg-gray-700/30 text-gray-300' : 'bg-white/30 text-gray-700'} hover:bg-white/50`
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Questions
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {quickQuestions.slice(0, 6).map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className={`text-left p-3 rounded-lg transition-all duration-300 ${
                darkMode ? 'bg-gray-700/30 hover:bg-gray-600/40 text-gray-300' : 'bg-white/30 hover:bg-white/50 text-gray-700'
              } border border-white/10 hover:border-white/30`}
              whileHover={{ scale: 1.02, x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{question}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div 
        className={`flex-1 backdrop-blur-xl rounded-2xl p-4 mb-4 overflow-y-auto ${
          darkMode ? 'bg-gray-800/20' : 'bg-white/20'
        } border border-white/20 shadow-inner`}
        style={{ maxHeight: '400px' }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 mb-4 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <motion.div
                className={`p-2 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {message.type === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </motion.div>
              
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <motion.div
                  className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                    message.type === 'user'
                      ? `bg-gradient-to-r from-blue-500 to-cyan-500 text-white`
                      : `${darkMode ? 'bg-gray-700/50' : 'bg-white/60'} ${darkMode ? 'text-gray-100' : 'text-gray-800'}`
                  } shadow-lg`}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-2 flex items-center space-x-1 ${
                    message.type === 'user' ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-3 mb-4"
            >
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Bot className="h-5 w-5 text-white" />
              </motion.div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-white/60'} shadow-lg`}>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`backdrop-blur-xl rounded-2xl p-4 ${
          darkMode ? 'bg-gray-800/30' : 'bg-white/40'
        } border border-white/20 shadow-lg`}
      >
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your health..."
              className={`w-full p-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                darkMode ? 'bg-gray-700/50 text-white placeholder-gray-400' : 'bg-white/60 text-gray-900 placeholder-gray-500'
              } shadow-inner`}
              disabled={isTyping}
            />
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
            >
              <Sparkles className="h-5 w-5 text-purple-500" />
            </motion.div>
          </div>
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className={`p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white transition-all duration-300 ${
              !inputMessage.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
            }`}
            whileHover={{ scale: !inputMessage.trim() || isTyping ? 1 : 1.05 }}
            whileTap={{ scale: !inputMessage.trim() || isTyping ? 1 : 0.95 }}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-between mt-3 text-xs"
        >
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Shield className="h-4 w-4" />
            <span>Your conversations are private and secure</span>
          </div>
          <div className={`flex items-center space-x-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Powered by AI</span>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AIAssistant;