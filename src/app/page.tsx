'use client';

import Link from "next/link";
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ReportPreview from './components/ReportPreview';
import ChatInterface from './components/ChatInterface';
import Toast from './components/Toast';
import { generateMockReportData, generateBulkReportData, generatePDFFromCelebrities } from '../lib/pdf-utils';
import { MediaReport } from '../types/report';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCelebrities, setSelectedCelebrities] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Music' | 'Entertainment' | 'Sports'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Preview states
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<MediaReport | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  // PDF and email states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPreparingEmail, setIsPreparingEmail] = useState(false);
  const [error, setError] = useState('');
  
  // Toast states
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false);
    }
  };

  // Generate Preview Handler
  const handleGeneratePreview = async () => {
    if (selectedCelebrities.length === 0) return;
    
    setIsGeneratingPreview(true);
    setError('');
    
    try {
      // Generate report data
      const reportData = selectedCelebrities.length === 1 
        ? generateMockReportData(selectedCelebrities[0])
        : generateBulkReportData(selectedCelebrities);
      
      setPreviewData(reportData);
      setPreviewMode(true);
    } catch (error) {
      console.error('Preview generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate preview');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // PDF Generation Handler
  const handleGeneratePDF = async () => {
    if (!previewData) return;
    
    setIsGeneratingPDF(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${previewData.client.replace(/[^a-zA-Z0-9]/g, '-')}-media-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast(`PDF downloaded successfully: ${fileName}`, 'success');
    } catch (error) {
      console.error('PDF generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
      setError(errorMessage);
      showToast(`PDF generation failed: ${errorMessage}`, 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Email Handler
  const handleSendEmail = async () => {
    if (!previewData) return;
    
    setIsPreparingEmail(true);
    setError('');
    
    try {
      showToast('Preparing email with PDF attachment...', 'info');
      
      // Generate PDF first
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewData),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF for email`);
      }

      const blob = await response.blob();
      const fileName = `${previewData.client.replace(/[^a-zA-Z0-9]/g, '-')}-media-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download PDF first
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Create detailed email content
      const subject = `Media Coverage Report - ${previewData.client} - ${new Date().toLocaleDateString('en-UK')}`;
      const body = `Dear Colleague,

Please find the attached media coverage report for ${previewData.client}.

REPORT HIGHLIGHTS:
• Total Articles: ${previewData.articles.length}
• Top Tier Coverage: ${previewData.articles.filter(a => a.tier === 'Top Tier').length} articles
• Estimated Total Reach: ${((previewData.total_estimated_reach || 0) / 1000000).toFixed(1)}M
• Overall Sentiment: ${previewData.overall_sentiment || 'Mixed'}

EXECUTIVE SUMMARY:
${previewData.summary}

KEY PUBLICATIONS:
${[...new Set(previewData.articles.filter(a => a.tier === 'Top Tier').map(a => a.source))].slice(0, 5).join(', ')}

The PDF report "${fileName}" has been downloaded to your computer - please attach it to this email before sending.

Best regards,
DawBell Ltd
Tel: 020 3327 7111
Email: info@dawbell.com
Web: dawbell.com

---
This is a confidential media intelligence report prepared by DawBell Ltd.`;

      // Use a more reliable method to open email client
      const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Try different methods to ensure email client opens
      try {
        window.open(emailUrl, '_self');
        showToast(`Email client opened with pre-filled content. PDF "${fileName}" downloaded - please attach it to your email.`, 'success');
      } catch (e) {
        // Fallback method
        const tempLink = document.createElement('a');
        tempLink.href = emailUrl;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        showToast(`Email client should open with pre-filled content. PDF "${fileName}" downloaded - please attach it to your email.`, 'success');
      }
      
    } catch (error) {
      console.error('Email preparation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare email';
      setError(errorMessage);
      showToast(`Email preparation failed: ${errorMessage}`, 'error');
    } finally {
      setIsPreparingEmail(false);
    }
  };

  // Back to selection
  const handleBackToSelection = () => {
    setPreviewMode(false);
    setPreviewData(null);
    setError('');
  };

  // Selection handlers
  const selectAll = () => {
    const filteredCelebrities = getFilteredCelebrities();
    setSelectedCelebrities(filteredCelebrities.map(c => c.name));
  };

  const clearAll = () => {
    setSelectedCelebrities([]);
  };

  const toggleCelebritySelection = (name: string) => {
    setSelectedCelebrities(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const celebrityData = [
    // Music
    { name: 'Taylor Swift', category: 'Music', lastGenerated: '20/07/2025', lastSpotted: '21/07/2025' },
    { name: 'Drake', category: 'Music', lastGenerated: '18/07/2025', lastSpotted: '19/07/2025' },
    { name: 'Billie Eilish', category: 'Music', lastGenerated: '15/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Ed Sheeran', category: 'Music', lastGenerated: '12/07/2025', lastSpotted: '20/07/2025' },
    { name: 'Ariana Grande', category: 'Music', lastGenerated: '10/07/2025', lastSpotted: '18/07/2025' },
    { name: 'The Weeknd', category: 'Music', lastGenerated: '08/07/2025', lastSpotted: '16/07/2025' },
    { name: 'Dua Lipa', category: 'Music', lastGenerated: '21/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Post Malone', category: 'Music', lastGenerated: '14/07/2025', lastSpotted: '17/07/2025' },
    { name: 'Olivia Rodrigo', category: 'Music', lastGenerated: '11/07/2025', lastSpotted: '19/07/2025' },
    { name: 'Harry Styles', category: 'Music', lastGenerated: '19/07/2025', lastSpotted: '21/07/2025' },
    { name: 'Adele', category: 'Music', lastGenerated: '16/07/2025', lastSpotted: '20/07/2025' },
    { name: 'Bruno Mars', category: 'Music', lastGenerated: '13/07/2025', lastSpotted: '15/07/2025' },
    { name: 'Beyoncé', category: 'Music', lastGenerated: '22/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Justin Bieber', category: 'Music', lastGenerated: '09/07/2025', lastSpotted: '14/07/2025' },
    { name: 'Bad Bunny', category: 'Music', lastGenerated: '17/07/2025', lastSpotted: '18/07/2025' },
    { name: 'SZA', category: 'Music', lastGenerated: '07/07/2025', lastSpotted: '13/07/2025' },
    { name: 'Kendrick Lamar', category: 'Music', lastGenerated: '05/07/2025', lastSpotted: '12/07/2025' },

    // Entertainment
    { name: 'Ryan Reynolds', category: 'Entertainment', lastGenerated: '21/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Emma Stone', category: 'Entertainment', lastGenerated: '19/07/2025', lastSpotted: '21/07/2025' },
    { name: 'Leonardo DiCaprio', category: 'Entertainment', lastGenerated: '18/07/2025', lastSpotted: '20/07/2025' },
    { name: 'Tom Holland', category: 'Entertainment', lastGenerated: '20/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Zendaya', category: 'Entertainment', lastGenerated: '22/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Margot Robbie', category: 'Entertainment', lastGenerated: '16/07/2025', lastSpotted: '19/07/2025' },
    { name: 'Chris Evans', category: 'Entertainment', lastGenerated: '15/07/2025', lastSpotted: '18/07/2025' },
    { name: 'Scarlett Johansson', category: 'Entertainment', lastGenerated: '14/07/2025', lastSpotted: '17/07/2025' },
    { name: 'Ryan Gosling', category: 'Entertainment', lastGenerated: '13/07/2025', lastSpotted: '16/07/2025' },
    { name: 'Jennifer Lawrence', category: 'Entertainment', lastGenerated: '17/07/2025', lastSpotted: '20/07/2025' },
    { name: 'Robert Downey Jr.', category: 'Entertainment', lastGenerated: '12/07/2025', lastSpotted: '15/07/2025' },
    { name: 'Anne Hathaway', category: 'Entertainment', lastGenerated: '11/07/2025', lastSpotted: '14/07/2025' },
    { name: 'Will Smith', category: 'Entertainment', lastGenerated: '10/07/2025', lastSpotted: '13/07/2025' },
    { name: 'Sandra Bullock', category: 'Entertainment', lastGenerated: '08/07/2025', lastSpotted: '11/07/2025' },
    { name: 'Dwayne Johnson', category: 'Entertainment', lastGenerated: '21/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Timothée Chalamet', category: 'Entertainment', lastGenerated: '09/07/2025', lastSpotted: '12/07/2025' },
    { name: 'Anya Taylor-Joy', category: 'Entertainment', lastGenerated: '06/07/2025', lastSpotted: '10/07/2025' },

    // Sports
    { name: 'Lionel Messi', category: 'Sports', lastGenerated: '22/07/2025', lastSpotted: '22/07/2025' },
    { name: 'Cristiano Ronaldo', category: 'Sports', lastGenerated: '21/07/2025', lastSpotted: '22/07/2025' },
    { name: 'LeBron James', category: 'Sports', lastGenerated: '20/07/2025', lastSpotted: '21/07/2025' },
    { name: 'Serena Williams', category: 'Sports', lastGenerated: '18/07/2025', lastSpotted: '20/07/2025' },
    { name: 'Tom Brady', category: 'Sports', lastGenerated: '17/07/2025', lastSpotted: '19/07/2025' },
    { name: 'Stephen Curry', category: 'Sports', lastGenerated: '19/07/2025', lastSpotted: '21/07/2025' },
    { name: 'Novak Djokovic', category: 'Sports', lastGenerated: '16/07/2025', lastSpotted: '18/07/2025' },
    { name: 'Lewis Hamilton', category: 'Sports', lastGenerated: '15/07/2025', lastSpotted: '17/07/2025' },
    { name: 'Simone Biles', category: 'Sports', lastGenerated: '14/07/2025', lastSpotted: '16/07/2025' },
    { name: 'Tiger Woods', category: 'Sports', lastGenerated: '13/07/2025', lastSpotted: '15/07/2025' },
    { name: 'Rafael Nadal', category: 'Sports', lastGenerated: '12/07/2025', lastSpotted: '14/07/2025' },
    { name: 'Usain Bolt', category: 'Sports', lastGenerated: '11/07/2025', lastSpotted: '13/07/2025' },
    { name: 'Michael Jordan', category: 'Sports', lastGenerated: '10/07/2025', lastSpotted: '12/07/2025' },
    { name: 'Kobe Bryant', category: 'Sports', lastGenerated: '08/07/2025', lastSpotted: '10/07/2025' },
    { name: 'Roger Federer', category: 'Sports', lastGenerated: '07/07/2025', lastSpotted: '09/07/2025' },
    { name: 'Patrick Mahomes', category: 'Sports', lastGenerated: '22/07/2025', lastSpotted: '22/07/2025' }
  ];

  const celebrities = {
    Music: celebrityData.filter(c => c.category === 'Music').map(c => c.name),
    Entertainment: celebrityData.filter(c => c.category === 'Entertainment').map(c => c.name),
    Sports: celebrityData.filter(c => c.category === 'Sports').map(c => c.name)
  };

  const allCelebrities = celebrityData.map(c => c.name);

  const getFilteredCelebrities = () => {
    let filtered = activeFilter === 'All' ? celebrityData : celebrityData.filter(c => c.category === activeFilter);
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(celebrity => 
        celebrity.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    return filtered;
  };

  // Preview Mode Rendering
  if (previewMode && previewData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            onNavigate={scrollToSection}
          />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            {/* Preview Header Controls */}
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToSelection}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Selection
                  </button>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    Preview for {selectedCelebrities.length} selected {selectedCelebrities.length === 1 ? 'celebrity' : 'celebrities'}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all shadow-md group ${
                      isGeneratingPDF 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isGeneratingPDF ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <span className="font-semibold">
                      {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleSendEmail}
                    disabled={isPreparingEmail}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all shadow-md group ${
                      isPreparingEmail 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                    }`}
                  >
                    {isPreparingEmail ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="font-semibold">
                      {isPreparingEmail ? 'Preparing...' : 'Send Email'}
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mt-3 max-w-7xl mx-auto">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Content with Chat */}
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-6">
                  {/* Report Preview */}
                  <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-h-screen overflow-y-auto">
                    <ReportPreview reportData={previewData} />
                  </div>
                  
                  {/* Chat Interface */}
                  <div className="w-80 flex-shrink-0">
                    <div className="sticky top-6 h-[calc(100vh-8rem)]">
                      <ChatInterface reportData={previewData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm text-gray-500">
              MachineTalents X UM Hackathon @ Google 2025. All rights reserved.
            </p>
          </div>
        </footer>
        
        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    );
  }

  // Selection Mode Rendering
  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onNavigate={scrollToSection}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Section 1: Celebrity Showcase */}
          <div id="celebrity-showcase" className="h-screen overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Celebrity Showcase</h2>
              
              {/* Control buttons */}
              <div className="flex justify-center gap-2 mb-6">
                <button 
                  onClick={selectAll}
                  className="px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-full hover:bg-gray-700 transition-all shadow-sm flex items-center gap-1.5 group"
                >
                  <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Select All
                </button>
                <button 
                  onClick={clearAll}
                  className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1.5 group"
                >
                  <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              </div>
              
              {/* Main content area with names and generate button */}
              <div className="flex gap-6">
                {/* Celebrity table */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Search and filter controls - right above table */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-4 items-center">
                      {/* Search bar */}
                      <div className="relative flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Search celebrities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      
                      {/* Filter buttons to the right */}
                      <div className="flex gap-2">
                        {['All', 'Music', 'Entertainment', 'Sports'].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                              activeFilter === filter
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {/* Fixed header */}
                    <div className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Last Generated</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Category</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Last Spotted</th>
                          </tr>
                        </thead>
                      </table>
                    </div>

                    {/* Scrollable body */}
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <tbody>
                          {getFilteredCelebrities().map((celebrity, index) => (
                            <tr 
                              key={celebrity.name} 
                              onClick={() => toggleCelebritySelection(celebrity.name)}
                              className={`cursor-pointer transition-all group ${
                                selectedCelebrities.includes(celebrity.name) 
                                  ? 'bg-gray-800 text-white' 
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                            >
                              <td className={`py-3 px-4 text-sm font-medium w-1/4 ${
                                selectedCelebrities.includes(celebrity.name) 
                                  ? 'text-white' 
                                  : 'text-gray-900 group-hover:text-gray-700'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    selectedCelebrities.includes(celebrity.name) 
                                      ? 'bg-green-400' 
                                      : 'bg-gray-400 group-hover:bg-gray-500'
                                  }`}></div>
                                  {celebrity.name}
                                </div>
                              </td>
                              <td className={`py-3 px-4 text-sm w-1/4 ${
                                selectedCelebrities.includes(celebrity.name) 
                                  ? 'text-gray-200' 
                                  : 'text-gray-600'
                              }`}>
                                {celebrity.lastGenerated}
                              </td>
                              <td className={`py-3 px-4 text-sm w-1/4 ${
                                selectedCelebrities.includes(celebrity.name) 
                                  ? 'text-gray-200' 
                                  : 'text-gray-600'
                              }`}>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  celebrity.category === 'Music' 
                                    ? 'bg-purple-100 text-purple-800'
                                    : celebrity.category === 'Entertainment'
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {celebrity.category}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-sm w-1/4 ${
                                selectedCelebrities.includes(celebrity.name) 
                                  ? 'text-gray-200' 
                                  : 'text-gray-600'
                              }`}>
                                {celebrity.lastSpotted}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {getFilteredCelebrities().length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No celebrities found matching your search.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Generate Preview Button */}
                <div className="flex flex-col justify-center min-w-[140px]">
                  <button 
                    onClick={handleGeneratePreview}
                    className={`px-6 py-4 text-sm font-medium rounded-2xl transition-all shadow-md flex flex-col items-center gap-2 group min-w-[140px] ${
                      selectedCelebrities.length > 0 && !isGeneratingPreview
                        ? 'bg-blue-600 text-white hover:bg-blue-700 opacity-100 cursor-pointer' 
                        : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={selectedCelebrities.length === 0 || isGeneratingPreview}
                  >
                    {isGeneratingPreview ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className={`w-6 h-6 transition-transform ${selectedCelebrities.length > 0 ? 'group-hover:scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                    <div className="text-center">
                      <div className="font-semibold">
                        {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
                      </div>
                      <div className="text-xs opacity-90">
                        {isGeneratingPreview 
                          ? 'Creating preview...' 
                          : selectedCelebrities.length > 0 
                            ? `${selectedCelebrities.length} selected` 
                            : 'Select celebrities'
                        }
                      </div>
                    </div>
                  </button>
                  
                  {/* Error message */}
                  {error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500">
            MachineTalents X UM Hackathon @ Google 2025. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
