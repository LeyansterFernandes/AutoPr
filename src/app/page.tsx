'use client';

import Link from "next/link";
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { generatePDFFromCelebrities } from '../lib/pdf-utils';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCelebrities, setSelectedCelebrities] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Music' | 'Entertainment' | 'Sports'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false); // Close sidebar after navigation
    }
  };

  // PDF Generation Handler
  const handleGenerateReport = async () => {
    if (selectedCelebrities.length === 0) return;
    
    setIsGeneratingPDF(true);
    setPdfError('');
    
    try {
      await generatePDFFromCelebrities(selectedCelebrities);
      // PDF download will happen automatically via the utility function
    } catch (error) {
      console.error('PDF generation failed:', error);
      setPdfError(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
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

                {/* Generate Report Button - always present, seamless transition */}
                <div className="flex flex-col justify-center min-w-[140px]">
                  <button 
                    onClick={handleGenerateReport}
                    className={`px-6 py-4 text-sm font-medium rounded-2xl transition-all shadow-md flex flex-col items-center gap-2 group min-w-[140px] ${
                      selectedCelebrities.length > 0 && !isGeneratingPDF
                        ? 'bg-green-600 text-white hover:bg-green-700 opacity-100 cursor-pointer' 
                        : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={selectedCelebrities.length === 0 || isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className={`w-6 h-6 transition-transform ${selectedCelebrities.length > 0 ? 'group-hover:scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <div className="text-center">
                      <div className="font-semibold">
                        {isGeneratingPDF ? 'Generating...' : 'Generate Report'}
                      </div>
                      <div className="text-xs opacity-90">
                        {isGeneratingPDF 
                          ? 'Creating PDF...' 
                          : selectedCelebrities.length > 0 
                            ? `${selectedCelebrities.length} selected` 
                            : 'Select celebrities'
                        }
                      </div>
                    </div>
                  </button>
                  
                  {/* Error message */}
                  {pdfError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600">{pdfError}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
