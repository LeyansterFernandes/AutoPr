// @ts-nocheck
// <reference types="node" />
// Pipeline: Scrape Google News, analyze, summarize, and output MediaReport JSON
// @ts-expect-error: Node.js types
import fs from 'fs';
// @ts-expect-error: Node.js types
import path from 'path';
import puppeteer from 'puppeteer';

// --- Types from user template ---
export interface MediaReport {
  client: string;
  summary: string;
  date?: string;
  date_range?: string;
  articles: Article[];
  total_estimated_reach?: number;
  overall_sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

export interface Article {
  title: string;
  source: string;
  tier: 'Top Tier' | 'Mid Tier' | 'Low Tier';
  coverage: 'Headline' | 'Mention';
  snippet: string;
  url: string;
  screenshot_url?: string;
  estimated_reach?: number;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  date_published?: string;
}

// --- Step 1: Scraper (Google News) ---
async function scrapeGoogleNews(query: string, maxArticles = 5): Promise<Article[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  // Set a real user-agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  const searchUrl = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US%3Aen`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Handle Google consent popup if present
  try {
    await page.waitForSelector('form[action*="consent"] button', { timeout: 5000 });
    await page.click('form[action*="consent"] button');
    await page.waitForTimeout(2000); // Wait for the page to reload
  } catch (e) {
    // No consent popup found, continue
  }

  // Wait for articles to load (increase timeout)
  await page.waitForSelector('article', { timeout: 60000 });

  const articles = await page.evaluate((maxArticles) => {
    const results = [];
    const articleNodes = document.querySelectorAll('article');
    for (let i = 0; i < Math.min(articleNodes.length, maxArticles); i++) {
      const node = articleNodes[i];
      // Headline
      const titleEl = node.querySelector('h3, h4');
      const title = titleEl ? titleEl.innerText : '';
      // Source
      const sourceEl = node.querySelector('div[role="heading"] ~ div span');
      const source = sourceEl ? sourceEl.innerText : '';
      // URL
      const linkEl = node.querySelector('a');
      let url = linkEl ? linkEl.href : '';
      if (url.startsWith('./')) {
        url = 'https://news.google.com' + url.slice(1);
      }
      // Snippet
      const snippetEl = node.querySelector('span:not([class])');
      const snippet = snippetEl ? snippetEl.innerText : '';
      // Date
      const dateEl = node.querySelector('time');
      const date_published = dateEl ? dateEl.getAttribute('datetime') : '';
      // Image
      let screenshot_url = '';
      const imgEl = node.querySelector('img');
      if (imgEl && imgEl.src && !imgEl.src.startsWith('data:')) {
        screenshot_url = imgEl.src;
      }
      results.push({
        title,
        source,
        url,
        snippet,
        date_published,
        screenshot_url,
        tier: 'Mid Tier', // Placeholder, will be set by analyst
        coverage: 'Mention', // Placeholder, will be set by analyst
      });
    }
    return results;
  }, maxArticles);

  await browser.close();
  return articles;
}

// --- Step 2: Media Analyst Agent ---
async function analyzeArticle(article: Article, client: string): Promise<Article> {
  // TODO: Use Google AI or mock logic for tagging
  return {
    ...article,
    tier: 'Top Tier', // Placeholder
    coverage: 'Headline', // Placeholder
    sentiment: 'Positive', // Placeholder
    estimated_reach: 100000, // Placeholder
  };
}

// --- Step 3: Copy Editor Agent ---
async function generateSummaryFromArticles(articles: Article[]): Promise<string> {
  if (!articles.length) return 'No articles found.';
  // Simple summary: combine headlines and snippets
  const highlights = articles.map(a => `- ${a.title}${a.snippet ? ': ' + a.snippet : ''}`).join('\n');
  return `This report summarizes ${articles.length} recent media mentions. Highlights include:\n${highlights}`;
}

// --- Step 4: Generate MediaReport JSON ---
export async function generateMediaReport(client: string, query: string) {
  const articlesRaw = await scrapeGoogleNews(query);
  const articles: Article[] = [];
  for (const raw of articlesRaw) {
    const analyzed = await analyzeArticle(raw, client);
    analyzed.snippet = await generateSummaryFromArticles(articles);
    articles.push(analyzed);
  }
  // Generate a real summary from all articles
  const summary = await generateSummaryFromArticles(articles);
  const report: MediaReport = {
    client,
    summary,
    articles,
    total_estimated_reach: articles.reduce((sum, a) => sum + (a.estimated_reach || 0), 0),
    overall_sentiment: 'Positive', // Placeholder
  };
  return report;
}

// --- CLI Entrypoint ---
if (typeof process !== 'undefined' && process.argv && import.meta.url === `file://${process.argv[1]}`) {
  const client = process.argv[2] || 'Demo Client';
  const query = process.argv[3] || 'technology';
  generateMediaReport(client, query).then(report => {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const outPath = path.join(__dirname, 'media-report.json');
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`Media report written to ${outPath}`);
  });
} 