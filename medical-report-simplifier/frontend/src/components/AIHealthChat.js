import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain,
  Zap,
  Activity,
  AlertCircle,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react';

const AIHealthChat = ({ analysisResult }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Health Assistant. I can help you understand your medical reports, answer health questions, and provide personalized recommendations. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "Explain my test results",
        "What do these values mean?",
        "Health improvement tips",
        "Risk assessment explanation"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate contextual responses based on analysis result and user input
    if (lowerMessage.includes('explain') || lowerMessage.includes('what does')) {
      if (analysisResult) {
        return {
          content: `Based on your recent analysis, here's what I can explain:\n\n🏥 **Health Score: ${analysisResult.health_score}/100**\nThis indicates ${analysisResult.health_score >= 80 ? 'excellent' : analysisResult.health_score >= 60 ? 'good' : 'needs attention'} overall health status.\n\n📊 **Key Findings:**\n${analysisResult.categories?.map(cat => `• ${cat.name}: ${cat.status} (Risk: ${cat.risk_level}/10)`).join('\n') || 'Processing your detailed results...'}\n\n💡 Would you like me to explain any specific parameter in detail?`,
          suggestions: ["Tell me about high risk items", "What should I improve?", "Lifestyle recommendations"]
        };
      } else {
        return {
          content: "I'd be happy to explain your test results! Please upload your medical report first, and I'll provide detailed explanations of all your health parameters, risk levels, and what they mean for your health.",
          suggestions: ["Upload a report", "How does the analysis work?", "What can you analyze?"]
        };
      }
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('danger')) {
      if (analysisResult) {
        const highRiskItems = analysisResult.categories?.filter(cat => cat.risk_level > 7) || [];
        return {
          content: `🚨 **Risk Assessment Overview:**\n\n${highRiskItems.length > 0 ? 
            `⚠️ **High Priority Items (${highRiskItems.length}):**\n${highRiskItems.map(item => `• ${item.name}: Risk Level ${item.risk_level}/10`).join('\n')}\n\n🩺 **Recommendation:** Please consult with your healthcare provider about these findings.` :
            '✅ **Good News!** Your analysis shows no high-risk parameters. Keep maintaining your current health habits!'
          }\n\n📈 **Overall Risk Score:** ${analysisResult.risk_score}/10`,
          suggestions: ["How to reduce risks?", "Prevention strategies", "When to see a doctor?"]
        };
      }
    }
    
    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('tips')) {
      return {
        content: `🌟 **Personalized Health Improvement Tips:**\n\n🥗 **Nutrition:**\n• Increase antioxidant-rich foods (berries, leafy greens)\n• Stay hydrated (8-10 glasses of water daily)\n• Consider omega-3 rich foods for heart health\n\n💪 **Physical Activity:**\n• Aim for 150 minutes of moderate exercise weekly\n• Include both cardio and strength training\n• Take regular walking breaks throughout the day\n\n😴 **Sleep & Recovery:**\n• Maintain 7-9 hours of quality sleep\n• Create a consistent sleep schedule\n• Practice stress management techniques\n\n🧘 **Mental Wellness:**\n• Practice mindfulness or meditation\n• Maintain social connections\n• Consider stress-reduction activities`,
        suggestions: ["Specific dietary advice", "Exercise recommendations", "Sleep improvement tips"]
      };
    }
    
    if (lowerMessage.includes('normal') || lowerMessage.includes('healthy')) {
      return {
        content: `📋 **Understanding Normal Ranges:**\n\nMedical "normal" ranges are based on 95% of healthy population values. However, optimal health often requires values in the upper-normal range.\n\n🎯 **Key Points:**\n• Normal doesn't always mean optimal\n• Individual variations are important\n• Trends matter more than single values\n• Context (age, gender, health history) affects interpretation\n\n💡 **Your personalized normal ranges** are calculated based on your demographics and health profile.`,
        suggestions: ["What's optimal for me?", "How to track trends?", "Age-specific ranges"]
      };
    }
    
    if (lowerMessage.includes('when') && lowerMessage.includes('doctor')) {
      return {
        content: `🩺 **When to Consult Your Healthcare Provider:**\n\n🚨 **Immediate Consultation Needed:**\n• Any red-flagged abnormal values\n• Sudden significant changes from previous tests\n• Multiple parameters outside normal range\n\n⚠️ **Schedule Appointment Soon:**\n• Persistent borderline abnormal values\n• New symptoms alongside test results\n• Unclear about medication effects\n\n✅ **Routine Follow-up:**\n• Annual health check-ups\n• Monitoring chronic conditions\n• Preventive screenings based on age/risk\n\n**Remember:** This AI analysis is educational only and doesn't replace professional medical advice.`,
        suggestions: ["How to prepare for doctor visit?", "Questions to ask doctor", "Understanding my report"]
      };
    }
    
    // Default responses for various topics
    const responses = [
      {
        content: "I understand you're looking for health information! I can help you with:\n\n🔬 **Medical Report Analysis**\n📊 **Understanding Test Results**\n💡 **Health Improvement Strategies**\n⚕️ **When to Seek Medical Care**\n🎯 **Preventive Health Tips**\n\nWhat specific area would you like to explore?",
        suggestions: ["Analyze my report", "Explain test values", "Health tips", "Risk factors"]
      },
      {
        content: "Great question! Here are some key areas I can help you understand better:\n\n🧬 **Biomarkers & Lab Values**\n❤️ **Cardiovascular Health**\n🍎 **Metabolic Health**\n🛡️ **Immune System Function**\n🧠 **Cognitive Health Indicators**\n\nWhich area interests you most?",
        suggestions: ["Heart health", "Blood sugar", "Cholesterol", "Kidney function"]
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Health Assistant</h3>
            <p className="text-white/80 text-sm">Always here to help with your health questions</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 ml-3' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white/20 hover:bg-white/30 text-xs px-3 py-1 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about your health..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHealthChat;