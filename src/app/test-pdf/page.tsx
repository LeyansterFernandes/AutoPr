'use client';

import { useState } from 'react';
import { MediaReport } from '../../types/report';

const sampleJson: MediaReport = {
  client: "Taylor Swift",
  summary: "Taylor Swift dominated entertainment news today with 8 high-profile mentions across major media outlets. Coverage centered around her surprise album announcement and environmental advocacy campaign. The sentiment was overwhelmingly positive, with particular emphasis on her artistic evolution and social impact. Total estimated reach of 22.8M across all platforms demonstrates exceptional cultural influence.",
  date: "March 16, 2024",
  date_range: "March 16-17, 2024",
  total_estimated_reach: 22800000,
  overall_sentiment: "Positive",
  articles: [
    {
      title: "Taylor Swift's Environmental Campaign Gains Global Support",
      source: "CNN Entertainment",
      tier: "Top Tier",
      coverage: "Headline", 
      snippet: "The megastar's latest environmental initiative has garnered support from world leaders and fellow celebrities, raising over $5 million for climate action in just 48 hours.",
      url: "https://cnn.com/entertainment/taylor-swift-environment",
      screenshot_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
      estimated_reach: 12500000,
      sentiment: "Positive",
      date_published: "16 Mar 2024"
    },
    {
      title: "Breaking: Taylor Swift Announces Surprise Album 'Midnight Echoes'",
      source: "Rolling Stone", 
      tier: "Top Tier",
      coverage: "Headline",
      snippet: "In an unexpected midnight social media post, Swift revealed her 11th studio album will drop next Friday, sending fans into a frenzy across social platforms.",
      url: "https://rollingstone.com/music/taylor-swift-midnight-echoes",
      screenshot_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      estimated_reach: 6800000,
      sentiment: "Positive",
      date_published: "16 Mar 2024"
    },
    {
      title: "Celebrity Fashion: Taylor Swift's Sustainable Style",
      source: "Harper's Bazaar",
      tier: "Mid Tier", 
      coverage: "Mention",
      snippet: "The singer's recent red carpet appearances showcase her commitment to sustainable fashion, wearing only recycled and ethically-sourced designs.",
      url: "https://harpersbazaar.com/fashion/taylor-swift-sustainable",
      estimated_reach: 1900000,
      sentiment: "Positive",
      date_published: "15 Mar 2024"
    },
    {
      title: "Social Media Roundup: Swift's Impact on Gen Z",
      source: "BuzzFeed",
      tier: "Low Tier",
      coverage: "Mention", 
      snippet: "Analysis shows Taylor Swift's influence on young voters continues to grow, with her latest posts driving significant engagement around climate issues.",
      url: "https://buzzfeed.com/taylor-swift-gen-z-impact",
      estimated_reach: 850000,
      sentiment: "Neutral",
      date_published: "17 Mar 2024"
    },
    {
      title: "Music Critics Divided on Swift's New Direction",
      source: "Pitchfork",
      tier: "Mid Tier",
      coverage: "Mention",
      snippet: "While some praise Swift's environmental activism, others question whether celebrities should lead political movements, creating debate among music critics.",
      url: "https://pitchfork.com/reviews/taylor-swift-activism",
      estimated_reach: 680000,
      sentiment: "Negative",
      date_published: "17 Mar 2024"
    },
    {
      title: "Stock Market: Swift's Label Shares Rise After Album News",
      source: "Financial Times",
      tier: "Low Tier",
      coverage: "Mention",
      snippet: "Republic Records parent company saw a 3% stock increase following Swift's surprise album announcement, demonstrating her continued commercial impact.",
      url: "https://ft.com/content/taylor-swift-stock-impact",
      estimated_reach: 420000,
      sentiment: "Positive",
      date_published: "17 Mar 2024"
    }
  ]
};

export default function TestPDFPage() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleJson, null, 2));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generatePDF = async (useCustomJson: boolean = false) => {
    setIsGenerating(true);
    setError('');

    try {
      let data: MediaReport;
      
      if (useCustomJson) {
        data = JSON.parse(jsonInput);
      } else {
        data = sampleJson;
      }

      console.log('Sending data:', data);

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'type:', blob.type);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.client}-media-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Full error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const testSamplePDF = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      console.log('Fetching sample PDF...');
      
      const response = await fetch('/api/test-pdf');
      
      console.log('Sample PDF response status:', response.status);
      console.log('Sample PDF response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sample PDF error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Sample PDF blob size:', blob.size, 'type:', blob.type);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'test-media-report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Sample PDF full error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            📄 AutoPR PDF Generator Test
          </h1>
          
          <div className="space-y-6">
            {/* Quick Test Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🚀 Quick Test
              </h2>
              <p className="text-gray-600 mb-4">
                Test the PDF generation with pre-built sample data (Dua Lipa):
              </p>
              <button
                onClick={testSamplePDF}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                {isGenerating ? 'Generating PDF...' : 'Download Sample PDF'}
              </button>
            </section>

            {/* Custom JSON Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🎛️ Custom JSON Test
              </h2>
              <p className="text-gray-600 mb-4">
                Edit the JSON below or paste your own data structure:
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Paste your JSON data here..."
                />
                
                <div className="flex gap-4">
                  <button
                    onClick={() => generatePDF(true)}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    {isGenerating ? 'Generating PDF...' : 'Generate PDF from JSON'}
                  </button>
                  
                  <button
                    onClick={() => setJsonInput(JSON.stringify(sampleJson, null, 2))}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Reset to Sample
                  </button>
                </div>
              </div>
            </section>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">❌</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error generating PDF
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* JSON Structure Guide */}
            <section className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Expected JSON Structure
              </h2>
              <pre className="text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto">
{`{
  "client": "Client Name",
  "summary": "Executive summary paragraph...",
  "date": "March 16, 2024", // optional
  "articles": [
    {
      "title": "Article headline",
      "source": "Publication name", 
      "tier": "Top Tier" | "Mid Tier" | "Low Tier",
      "coverage": "Headline" | "Mention",
      "snippet": "Quote or excerpt from article...",
      "url": "https://example.com/article",
      "screenshot_url": "https://example.com/image.jpg" // optional
    }
  ]
}`}
              </pre>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 