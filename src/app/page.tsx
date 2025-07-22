"use client";

import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Section 1: Current clean layout */}
          <div className="h-screen flex items-center justify-center p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to AutoPr</h1>
              <p className="text-lg text-gray-600">Your corporate workspace</p>
            </div>
          </div>

          {/* Section 2: Search */}
          <div className="h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Search</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    className="w-full px-4 py-4 pl-12 text-lg text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Documents</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Reports</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Analytics</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Chatbot */}
          <div className="h-screen flex flex-col p-8 bg-white">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chat Assistant</h2>
            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
              {/* Chat messages area */}
              <div className="flex-1 bg-gray-50 rounded-lg p-6 mb-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Bot message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                      <p className="text-gray-800">Hello! I'm your AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                  
                  {/* User message */}
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-blue-500 rounded-lg p-4 shadow-sm max-w-md">
                      <p className="text-white">Hi there! I need help with my project.</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Chat input area */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
