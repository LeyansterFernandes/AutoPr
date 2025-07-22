'use client';

import { useState } from 'react';
import { MediaReport } from '../../types/report';

interface ChatInterfaceProps {
  reportData: MediaReport;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface({ reportData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm here to help you analyze the media coverage report for ${reportData.client}. I can answer questions about the coverage, sentiment, reach, or any specific articles. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const totalReach = reportData.total_estimated_reach || reportData.articles.reduce((sum, article) => sum + (article.estimated_reach || 0), 0);
    const topTierCount = reportData.articles.filter(a => a.tier === 'Top Tier').length;
    const positiveCount = reportData.articles.filter(a => a.sentiment === 'Positive').length;
    const negativeCount = reportData.articles.filter(a => a.sentiment === 'Negative').length;

    // Simple keyword-based responses
    if (lowerMessage.includes('reach') || lowerMessage.includes('audience')) {
      return `The total estimated reach for ${reportData.client} is ${(totalReach / 1000000).toFixed(1)}M across all ${reportData.articles.length} articles. The top-performing article reached ${Math.max(...reportData.articles.map(a => a.estimated_reach || 0))} people.`;
    }
    
    if (lowerMessage.includes('sentiment') || lowerMessage.includes('positive') || lowerMessage.includes('negative')) {
      return `The sentiment analysis shows ${positiveCount} positive articles, ${reportData.articles.filter(a => a.sentiment === 'Neutral').length} neutral, and ${negativeCount} negative. Overall, the coverage sentiment is ${reportData.overall_sentiment || 'Mixed'}.`;
    }

    if (lowerMessage.includes('top tier') || lowerMessage.includes('best')) {
      const topSources = reportData.articles.filter(a => a.tier === 'Top Tier').map(a => a.source);
      return `${reportData.client} received ${topTierCount} top-tier mentions from publications like ${topSources.slice(0, 3).join(', ')}. These represent the highest-quality coverage in the report.`;
    }

    if (lowerMessage.includes('source') || lowerMessage.includes('publication')) {
      const sources = [...new Set(reportData.articles.map(a => a.source))];
      return `The coverage spans ${sources.length} different publications including ${sources.slice(0, 4).join(', ')}${sources.length > 4 ? ' and others' : ''}.`;
    }

    if (lowerMessage.includes('headline') || lowerMessage.includes('story')) {
      const headlines = reportData.articles.filter(a => a.coverage === 'Headline').length;
      const mentions = reportData.articles.filter(a => a.coverage === 'Mention').length;
      return `Out of ${reportData.articles.length} total articles, ${headlines} featured ${reportData.client} as the main headline story, while ${mentions} mentioned them within broader coverage.`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return reportData.summary;
    }

    if (lowerMessage.includes('recommendation') || lowerMessage.includes('advice') || lowerMessage.includes('next')) {
      const hasNegative = negativeCount > 0;
      const hasLowReach = totalReach < 5000000;
      
      if (hasNegative && hasLowReach) {
        return `I'd recommend addressing the ${negativeCount} negative coverage pieces and focusing on higher-reach publications for future campaigns. Consider targeted outreach to top-tier outlets.`;
      } else if (hasNegative) {
        return `While reach is strong, consider developing messaging to address the ${negativeCount} negative coverage pieces. The positive sentiment from top-tier sources provides good foundation.`;
      } else if (hasLowReach) {
        return `The sentiment is positive, but reach could be improved. Consider targeting higher-circulation publications and exploring social media amplification strategies.`;
      }
      
      return `Excellent coverage! Strong positive sentiment and good reach. Consider leveraging this momentum for upcoming announcements or campaigns.`;
    }

    // Default response
    const randomResponses = [
      `I can help you analyze various aspects of ${reportData.client}'s media coverage. Try asking about reach, sentiment, top publications, or recommendations.`,
      `The report shows comprehensive coverage across ${reportData.articles.length} articles. What specific aspect would you like me to explain?`,
      `I have detailed information about ${reportData.client}'s media coverage. Ask me about the analytics, specific articles, or strategic insights.`
    ];
    
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Report Assistant</h3>
            <p className="text-xs text-gray-500">Ask questions about the coverage</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about reach, sentiment, sources..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 