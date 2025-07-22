import { MediaReport, Article } from '../types/report';

export function generateReportHTML(data: MediaReport): string {
  const currentDate = data.date || new Date().toLocaleDateString('en-UK', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  // Group articles by tier for better organization
  const topTierArticles = data.articles.filter(a => a.tier === 'Top Tier');
  const midTierArticles = data.articles.filter(a => a.tier === 'Mid Tier');
  const lowTierArticles = data.articles.filter(a => a.tier === 'Low Tier');

  // Calculate analytics
  const totalReach = data.total_estimated_reach || data.articles.reduce((sum, article) => sum + (article.estimated_reach || 0), 0);
  const positiveArticles = data.articles.filter(a => a.sentiment === 'Positive').length;
  const negativeArticles = data.articles.filter(a => a.sentiment === 'Negative').length;
  const neutralArticles = data.articles.filter(a => a.sentiment === 'Neutral').length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Coverage Report - ${data.client}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #2c2c2c;
      background: #ffffff;
      font-size: 14px;
      font-weight: 400;
    }
    
    .report-container {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e8e8e8;
      padding-bottom: 32px;
      margin-bottom: 40px;
      page-break-after: avoid;
    }
    
    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 24px;
    }
    
    .logo-container {
      width: 80px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      flex-shrink: 0;
    }
    
    .logo-image {
      max-width: 80px;
      max-height: 50px;
      width: auto;
      height: auto;
    }
    
    .header-main {
      flex: 1;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #2c2c2c;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .client-name {
      font-size: 18px;
      font-weight: 600;
      color: #4a4a4a;
      margin-bottom: 4px;
    }
    
    .report-date {
      font-size: 14px;
      color: #6a6a6a;
      font-weight: 400;
    }
    
    .header-right {
      text-align: right;
      font-size: 11px;
      color: #8a8a8a;
      flex-shrink: 0;
    }
    
    .summary-section {
      background: #f8f9fa;
      border-left: 4px solid #2c2c2c;
      padding: 28px;
      margin-bottom: 40px;
      border-radius: 0 8px 8px 0;
      page-break-after: avoid;
    }
    
    .summary-section h2 {
      font-size: 20px;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 16px;
    }
    
    .summary-section p {
      font-size: 15px;
      line-height: 1.7;
      color: #4a4a4a;
      font-weight: 400;
    }
    
    .analytics-section {
      background: #ffffff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    
    .analytics-header {
      font-size: 16px;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 16px;
      text-align: center;
    }
    
    .analytics-item {
      padding: 16px 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e8e8e8;
    }
    
    .analytics-number {
      font-size: 24px;
      font-weight: 700;
      color: #2c2c2c;
      display: block;
    }
    
    .analytics-label {
      font-size: 10px;
      color: #6a6a6a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
      font-weight: 500;
    }
    
    .reach-highlight {
      color: #e50815 !important;
    }
    
    .sentiment-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }
    
    .sentiment-item {
      padding: 12px 8px;
      border-radius: 6px;
      text-align: center;
      border: 1px solid;
    }
    
    .sentiment-positive {
      background: #e8f5e8;
      border-color: #d4edd4;
      color: #2d5a2d;
    }
    
    .sentiment-neutral {
      background: #f5f5f5;
      border-color: #e0e0e0;
      color: #6a6a6a;
    }
    
    .sentiment-negative {
      background: #fef2f2;
      border-color: #f8d7d7;
      color: #b91c1c;
    }
    
    .sentiment-number {
      font-size: 18px;
      font-weight: 600;
      display: block;
    }
    
    .sentiment-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }
    
    .tier-section {
      margin-bottom: 40px;
    }
    
    .tier-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;
      page-break-after: avoid;
    }
    
    .tier-title {
      font-size: 18px;
      font-weight: 600;
      color: #2c2c2c;
    }
    
    .tier-count {
      background: #f0f0f0;
      color: #6a6a6a;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .tier-badge-large {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .tier-toptier-large {
      background: #e8f5e8;
      color: #2d5a2d;
      border: 1px solid #d4edd4;
    }
    
    .tier-midtier-large {
      background: #fff4e6;
      color: #b8620a;
      border: 1px solid #f2d7b8;
    }
    
    .tier-lowtier-large {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #f8d7d7;
    }
    
    .article {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
      background: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .article-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 16px;
    }
    
    .article-title-link {
      font-size: 18px;
      font-weight: 600;
      color: #2c2c2c;
      text-decoration: none;
      line-height: 1.3;
      flex: 1;
      transition: color 0.2s ease;
      cursor: pointer;
    }
    
    .article-title-link:hover {
      color: #4a4a4a;
      text-decoration: underline;
    }
    
    .article-analytics {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }
    
    .reach-stat {
      font-size: 12px;
      font-weight: 600;
      color: #e50815;
    }
    
    .date-stat {
      font-size: 11px;
      color: #8a8a8a;
    }
    
    .article-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      align-items: center;
    }
    
    .article-source {
      font-size: 14px;
      font-weight: 500;
      color: #4a4a4a;
    }
    
    .article-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    
    .tier-badge {
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .tier-toptier {
      background: #e8f5e8;
      color: #2d5a2d;
      border: 1px solid #d4edd4;
    }
    
    .tier-midtier {
      background: #fff4e6;
      color: #b8620a;
      border: 1px solid #f2d7b8;
    }
    
    .tier-lowtier {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #f8d7d7;
    }
    
    .coverage-badge {
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 500;
      background: #f0f0f0;
      color: #6a6a6a;
      border: 1px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .sentiment-badge {
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .sentiment-positive-badge {
      background: #e8f5e8;
      color: #2d5a2d;
      border: 1px solid #d4edd4;
    }
    
    .sentiment-neutral-badge {
      background: #f5f5f5;
      color: #6a6a6a;
      border: 1px solid #e0e0e0;
    }
    
    .sentiment-negative-badge {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #f8d7d7;
    }
    
    .article-snippet {
      font-size: 14px;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 16px 0;
      font-style: italic;
      padding: 16px;
      background: #f8f9fa;
      border-left: 3px solid #e0e0e0;
      border-radius: 0 6px 6px 0;
      position: relative;
    }
    
    .article-snippet:before {
      content: '"';
      font-size: 32px;
      color: #d0d0d0;
      position: absolute;
      top: 4px;
      left: 6px;
      font-family: Georgia, serif;
    }
    
    .article-url {
      font-size: 11px;
      color: #2c2c2c;
      text-decoration: none;
      word-break: break-all;
      background: #f5f5f5;
      padding: 6px 10px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 8px;
      border: 1px solid #e8e8e8;
      transition: background-color 0.2s ease;
    }
    
    .article-url:hover {
      background: #e8e8e8;
      text-decoration: underline;
    }
    
    .article-screenshot {
      margin: 16px 0;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .article-screenshot img {
      max-width: 100%;
      max-height: 200px;
      height: auto;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e8e8e8;
    }
    
    .footer {
      margin-top: 48px;
      padding: 24px 0;
      border-top: 1px solid #e8e8e8;
      color: #6a6a6a;
      font-size: 11px;
      background: #f8f9fa;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .footer-left {
      font-weight: 400;
    }
    
    .footer-right {
      text-align: right;
      color: #8a8a8a;
    }
    
    .copyright-section {
      border-top: 1px solid #e8e8e8;
      padding-top: 16px;
      text-align: center;
      font-size: 10px;
      color: #8a8a8a;
      line-height: 1.4;
    }
    
    .copyright-section p {
      margin-bottom: 4px;
    }
    
    /* Print-specific styles */
    @media print {
      .report-container {
        max-width: none;
      }
      
      .article {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .header {
        page-break-after: avoid;
      }
      
      .summary-section {
        page-break-after: avoid;
      }
      
      .tier-header {
        page-break-after: avoid;
      }
      
      .analytics-section {
        page-break-inside: avoid;
      }
      
      a {
        color: inherit;
        text-decoration: none;
      }
      
      .article-url {
        color: #2c2c2c;
      }
    }
    
    @page {
      margin: 0.75in;
      size: A4;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Professional Header with DawBell Branding -->
    <header class="header">
      <div class="header-left">
        <div class="logo-container">
          <img src="/dawbell-logo.png" alt="DawBell Logo" class="logo-image" />
        </div>
        <div class="header-main">
          <h1>Media Coverage Report</h1>
          <div class="client-name">Client: ${data.client}</div>
          <div class="report-date">Report Date: ${data.date_range || currentDate}</div>
        </div>
      </div>
      <div class="header-right">
        <strong>CONFIDENTIAL</strong><br>
        Generated: ${new Date().toLocaleDateString('en-UK')}
      </div>
    </header>

    <!-- Executive Summary -->
    <section class="summary-section">
      <h2>Executive Summary</h2>
      <p>${data.summary}</p>
    </section>

    <!-- Analytics & Key Metrics -->
    <section class="analytics-section">
      <div class="analytics-header">Coverage Analytics</div>
      <div class="analytics-grid">
        <div class="analytics-item">
          <span class="analytics-number">${data.articles.length}</span>
          <div class="analytics-label">Total Articles</div>
        </div>
        <div class="analytics-item">
          <span class="analytics-number">${topTierArticles.length}</span>
          <div class="analytics-label">Top Tier</div>
        </div>
        <div class="analytics-item">
          <span class="analytics-number">${midTierArticles.length}</span>
          <div class="analytics-label">Mid Tier</div>
        </div>
        <div class="analytics-item">
          <span class="analytics-number">${lowTierArticles.length}</span>
          <div class="analytics-label">Low Tier</div>
        </div>
        <div class="analytics-item">
          <span class="analytics-number">${data.articles.filter(a => a.coverage === 'Headline').length}</span>
          <div class="analytics-label">Headlines</div>
        </div>
        <div class="analytics-item">
          <span class="analytics-number reach-highlight">${formatNumber(totalReach)}</span>
          <div class="analytics-label">Est. Reach</div>
        </div>
      </div>
      
      ${(positiveArticles > 0 || negativeArticles > 0 || neutralArticles > 0) ? `
        <div class="sentiment-grid">
          <div class="sentiment-item sentiment-positive">
            <span class="sentiment-number">${positiveArticles}</span>
            <div class="sentiment-label">Positive</div>
          </div>
          <div class="sentiment-item sentiment-neutral">
            <span class="sentiment-number">${neutralArticles}</span>
            <div class="sentiment-label">Neutral</div>
          </div>
          <div class="sentiment-item sentiment-negative">
            <span class="sentiment-number">${negativeArticles}</span>
            <div class="sentiment-label">Negative</div>
          </div>
        </div>
      ` : ''}
    </section>

    <!-- Coverage Entries Grouped by Tier -->
    ${generateTierSection('Top Tier', topTierArticles, 'tier-toptier-large')}
    ${generateTierSection('Mid Tier', midTierArticles, 'tier-midtier-large')}
    ${generateTierSection('Low Tier', lowTierArticles, 'tier-lowtier-large')}

    <!-- Professional Footer with Copyright -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <strong>DawBell Ltd</strong><br>
          020 3327 7111 | info@dawbell.com<br>
          Report generated: ${new Date().toLocaleString('en-UK')}
        </div>
        <div class="footer-right">
          <strong>Confidential & Proprietary</strong><br>
          This report contains confidential information<br>
          intended solely for the named client.
        </div>
      </div>
      
      <div class="copyright-section">
        <p>© ${new Date().getFullYear()} DawBell Ltd. All rights reserved.</p>
        <p>This report and its contents are the intellectual property of DawBell Ltd and are protected by copyright law.</p>
        <p>No part of this publication may be reproduced, distributed, or transmitted without prior written permission.</p>
        <p><strong>Trademark Notice:</strong> DawBell® is a registered trademark of DawBell Ltd. All other trademarks mentioned herein are the property of their respective owners.</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function generateTierSection(tierName: string, articles: Article[], badgeClass: string): string {
  if (articles.length === 0) return '';
  
  return `
    <section class="tier-section">
      <div class="tier-header">
        <h2 class="tier-title">${tierName}</h2>
        <span class="tier-count">${articles.length} article${articles.length === 1 ? '' : 's'}</span>
        <span class="tier-badge-large ${badgeClass}">${tierName}</span>
      </div>
      ${articles.map(article => generateArticleHTML(article)).join('')}
    </section>
  `;
}

function generateArticleHTML(article: Article): string {
  const tierClass = `tier-${article.tier.toLowerCase().replace(' ', '')}`;
  const sentimentClass = article.sentiment ? `sentiment-${article.sentiment.toLowerCase()}-badge` : '';
  
  return `
    <article class="article">
      <div class="article-header">
        <a href="${article.url}" class="article-title-link" target="_blank">
          ${article.title}
        </a>
        ${article.estimated_reach || article.date_published ? `
          <div class="article-analytics">
            ${article.estimated_reach ? `<div class="reach-stat">${formatNumber(article.estimated_reach)} reach</div>` : ''}
            ${article.date_published ? `<div class="date-stat">${article.date_published}</div>` : ''}
          </div>
        ` : ''}
      </div>
      
      <div class="article-meta-row">
        <div class="article-source">Source: ${article.source}</div>
        <div class="article-badges">
          <span class="tier-badge ${tierClass}">${article.tier}</span>
          <span class="coverage-badge">${article.coverage}</span>
          ${article.sentiment ? `<span class="sentiment-badge ${sentimentClass}">${article.sentiment}</span>` : ''}
        </div>
      </div>
      
      <blockquote class="article-snippet">${article.snippet}</blockquote>
      
      ${article.screenshot_url ? `
        <div class="article-screenshot">
          <img src="${article.screenshot_url}" alt="Screenshot of ${article.title}" />
        </div>
      ` : ''}
      
      <a href="${article.url}" class="article-url" target="_blank">${article.url}</a>
    </article>
  `;
} 