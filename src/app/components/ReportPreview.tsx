'use client';

import { MediaReport } from '../../types/report';

interface ReportPreviewProps {
  reportData: MediaReport;
}

export default function ReportPreview({ reportData }: ReportPreviewProps) {
  const currentDate = reportData.date || new Date().toLocaleDateString('en-UK', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  // Calculate analytics
  const topTierArticles = reportData.articles.filter(a => a.tier === 'Top Tier');
  const midTierArticles = reportData.articles.filter(a => a.tier === 'Mid Tier');
  const lowTierArticles = reportData.articles.filter(a => a.tier === 'Low Tier');
  const totalReach = reportData.total_estimated_reach || reportData.articles.reduce((sum, article) => sum + (article.estimated_reach || 0), 0);
  const positiveArticles = reportData.articles.filter(a => a.sentiment === 'Positive').length;
  const negativeArticles = reportData.articles.filter(a => a.sentiment === 'Negative').length;
  const neutralArticles = reportData.articles.filter(a => a.sentiment === 'Neutral').length;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'Top Tier': return 'bg-green-100 text-green-700 border-green-200';
      case 'Mid Tier': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low Tier': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'Neutral': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-6">
            <div className="w-16 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              DB
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Coverage Report</h1>
              <div className="text-lg font-semibold text-gray-700">Client: {reportData.client}</div>
              <div className="text-sm text-gray-500">Report Date: {reportData.date_range || currentDate}</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <div className="font-semibold">CONFIDENTIAL</div>
            <div>Generated: {new Date().toLocaleDateString('en-UK')}</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-50 border-l-4 border-gray-800 p-6 rounded-r-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
        <p className="text-gray-700 leading-relaxed">{reportData.summary}</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Coverage Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{reportData.articles.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Articles</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{topTierArticles.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Top Tier</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{midTierArticles.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Mid Tier</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{lowTierArticles.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Low Tier</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{reportData.articles.filter(a => a.coverage === 'Headline').length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Headlines</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{formatNumber(totalReach)}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Est. Reach</div>
          </div>
        </div>

        {/* Sentiment breakdown */}
        {(positiveArticles > 0 || negativeArticles > 0 || neutralArticles > 0) && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-semibold text-green-700">{positiveArticles}</div>
              <div className="text-xs text-green-600 uppercase">Positive</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-lg font-semibold text-gray-700">{neutralArticles}</div>
              <div className="text-xs text-gray-600 uppercase">Neutral</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-semibold text-red-700">{negativeArticles}</div>
              <div className="text-xs text-red-600 uppercase">Negative</div>
            </div>
          </div>
        )}
      </div>

      {/* Articles by Tier */}
      {[
        { name: 'Top Tier', articles: topTierArticles, color: 'green' },
        { name: 'Mid Tier', articles: midTierArticles, color: 'yellow' },
        { name: 'Low Tier', articles: lowTierArticles, color: 'red' }
      ].map(({ name, articles, color }) => {
        if (articles.length === 0) return null;

        return (
          <div key={name} className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {articles.length} article{articles.length === 1 ? '' : 's'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeClass(name)}`}>
                {name}
              </span>
            </div>

            <div className="space-y-6">
              {articles.map((article, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors flex-1 mr-4"
                    >
                      {article.title}
                    </a>
                    <div className="text-right text-sm text-gray-500 flex-shrink-0">
                      {article.estimated_reach && (
                        <div className="font-semibold text-red-600">{formatNumber(article.estimated_reach)} reach</div>
                      )}
                      {article.date_published && (
                        <div>{article.date_published}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">Source: {article.source}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierBadgeClass(article.tier)}`}>
                      {article.tier}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                      {article.coverage}
                    </span>
                    {article.sentiment && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentBadgeClass(article.sentiment)}`}>
                        {article.sentiment}
                      </span>
                    )}
                  </div>

                  <blockquote className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-4 italic text-gray-700">
                    "{article.snippet}"
                  </blockquote>

                  {article.screenshot_url && (
                    <div className="mb-4">
                      <img 
                        src={article.screenshot_url} 
                        alt={`Screenshot of ${article.title}`}
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded border border-gray-200 inline-block"
                  >
                    {article.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 mt-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-start text-sm text-gray-600 mb-4">
          <div>
            <div className="font-semibold">DawBell Ltd</div>
            <div>020 3327 7111 | info@dawbell.com</div>
            <div>Report generated: {new Date().toLocaleString('en-UK')}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Confidential & Proprietary</div>
            <div>This report contains confidential information</div>
            <div>intended solely for the named client.</div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>© {new Date().getFullYear()} DawBell Ltd. All rights reserved.</p>
          <p>This report and its contents are the intellectual property of DawBell Ltd and are protected by copyright law.</p>
        </div>
      </div>
    </div>
  );
} 