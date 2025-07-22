export interface Article {
  title: string;
  source: string;
  tier: 'Top Tier' | 'Mid Tier' | 'Low Tier';
  coverage: 'Headline' | 'Mention';
  snippet: string;
  url: string;
  screenshot_url?: string;
  estimated_reach?: number; // Estimated readership/views
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  date_published?: string; // When the article was published
}

export interface MediaReport {
  client: string;
  summary: string;
  date?: string;
  date_range?: string; // e.g., "July 15-22, 2024"
  articles: Article[];
  total_estimated_reach?: number; // Sum of all article reach
  overall_sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
} 