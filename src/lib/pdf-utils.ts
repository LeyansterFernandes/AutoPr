import { MediaReport } from '../types/report';

// Mock data generator for different celebrities
export const generateMockReportData = (celebrityName: string): MediaReport => {
  const baseReach = Math.floor(Math.random() * 10000000) + 1000000; // 1M-11M reach
  const articleCount = Math.floor(Math.random() * 8) + 3; // 3-10 articles
  
  const mockArticles = generateMockArticles(celebrityName, articleCount);
  const totalReach = mockArticles.reduce((sum, article) => sum + (article.estimated_reach || 0), 0);
  
  return {
    client: celebrityName,
    summary: `${celebrityName} received significant media coverage with ${articleCount} mentions across major entertainment outlets. The coverage was overwhelmingly positive, focusing on recent projects and public appearances. Notable highlights include top-tier coverage in major publications and strong social media engagement. Total estimated reach of ${formatReachNumber(totalReach)} demonstrates exceptional visibility across key demographics.`,
    date: new Date().toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }),
    date_range: getDateRange(),
    total_estimated_reach: totalReach,
    overall_sentiment: getRandomSentiment(),
    articles: mockArticles
  };
};

// Generate multiple celebrity reports
export const generateBulkReportData = (celebrityNames: string[]): MediaReport => {
  const totalArticles = celebrityNames.length * (Math.floor(Math.random() * 3) + 2); // 2-4 articles per celebrity
  const mockArticles: any[] = [];
  
  celebrityNames.forEach(name => {
    const articlesForCelebrity = Math.floor(Math.random() * 3) + 1; // 1-3 articles per celebrity
    mockArticles.push(...generateMockArticles(name, articlesForCelebrity));
  });
  
  const totalReach = mockArticles.reduce((sum, article) => sum + (article.estimated_reach || 0), 0);
  
  return {
    client: celebrityNames.length > 1 ? `${celebrityNames[0]} + ${celebrityNames.length - 1} others` : celebrityNames[0],
    summary: `Comprehensive media coverage report for ${celebrityNames.length} ${celebrityNames.length === 1 ? 'celebrity' : 'celebrities'} with ${mockArticles.length} total mentions across major entertainment outlets. The coverage spans multiple categories and demonstrates strong engagement across all platforms. Combined estimated reach of ${formatReachNumber(totalReach)} shows significant cultural impact.`,
    date: new Date().toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }),
    date_range: getDateRange(),
    total_estimated_reach: totalReach,
    overall_sentiment: "Positive",
    articles: mockArticles.slice(0, 20) // Limit to 20 articles max for readability
  };
};

function generateMockArticles(celebrityName: string, count: number) {
  const articles = [];
  const sources = [
    { name: "BBC Entertainment", tier: "Top Tier" },
    { name: "The Guardian", tier: "Top Tier" },
    { name: "CNN Entertainment", tier: "Top Tier" },
    { name: "Rolling Stone", tier: "Top Tier" },
    { name: "Billboard", tier: "Top Tier" },
    { name: "Variety", tier: "Top Tier" },
    { name: "Hollywood Reporter", tier: "Mid Tier" },
    { name: "Vogue UK", tier: "Mid Tier" },
    { name: "NME", tier: "Mid Tier" },
    { name: "Harper's Bazaar", tier: "Mid Tier" },
    { name: "Entertainment Weekly", tier: "Low Tier" },
    { name: "BuzzFeed", tier: "Low Tier" },
    { name: "E! News", tier: "Low Tier" }
  ];
  
  const headlines = [
    `${celebrityName} Stuns at Red Carpet Premiere`,
    `Breaking: ${celebrityName} Announces Major New Project`,
    `${celebrityName}'s Latest Performance Receives Critical Acclaim`,
    `Inside ${celebrityName}'s Charitable Initiative`,
    `${celebrityName} Trends on Social Media After Latest Appearance`,
    `Music Industry Insider: ${celebrityName}'s Strategic Career Moves`,
    `Fashion Icon ${celebrityName} Sets New Trends`,
    `${celebrityName}'s Environmental Campaign Gains Support`,
    `Concert Review: ${celebrityName} Delivers Unforgettable Show`,
    `Celebrity Style: ${celebrityName}'s Fashion Evolution`
  ];
  
  const snippets = [
    `In a stunning move that surprised fans worldwide, ${celebrityName} delivered an exceptional performance that showcased their artistic evolution and commitment to excellence.`,
    `The star's latest initiative has garnered support from industry leaders and fans alike, demonstrating their influence beyond entertainment.`,
    `Critics and audiences agree that ${celebrityName}'s recent work represents a new chapter in their already impressive career.`,
    `${celebrityName}'s commitment to social causes continues to inspire fans and fellow celebrities, showing their dedication to making a positive impact.`,
    `The entertainment industry is buzzing about ${celebrityName}'s latest project, which promises to be their most ambitious work yet.`,
    `Fashion experts praise ${celebrityName}'s style choices, noting their ability to set trends while maintaining authenticity.`,
    `${celebrityName}'s business acumen continues to impress industry insiders, with strategic partnerships that benefit both their career and chosen causes.`
  ];
  
  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const headline = headlines[Math.floor(Math.random() * headlines.length)];
    const snippet = snippets[Math.floor(Math.random() * snippets.length)];
    
    const baseReach = source.tier === "Top Tier" ? 2000000 : source.tier === "Mid Tier" ? 800000 : 300000;
    const reach = baseReach + Math.floor(Math.random() * baseReach * 0.5);
    
    articles.push({
      title: headline,
      source: source.name,
      tier: source.tier as "Top Tier" | "Mid Tier" | "Low Tier",
      coverage: Math.random() > 0.4 ? "Headline" : "Mention" as "Headline" | "Mention",
      snippet: snippet,
      url: `https://${source.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/${celebrityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`,
      screenshot_url: getRandomImage(),
      estimated_reach: reach,
      sentiment: getRandomSentiment(),
      date_published: getRandomDate()
    });
  }
  
  return articles;
}

function getRandomImage(): string {
  const imageIds = [
    "photo-1493225457124-a3eb161ffa5f",
    "photo-1516450360452-9312f5e86fc7",
    "photo-1470225620780-dba8ba36b745",
    "photo-1571019613454-1cb2f99b2d8b",
    "photo-1598928506311-c55ded91a20c",
    "photo-1522794338816-ee3a8b5f7db9"
  ];
  
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?w=600&h=400&fit=crop`;
}

function getRandomSentiment(): "Positive" | "Neutral" | "Negative" {
  const rand = Math.random();
  if (rand > 0.7) return "Positive";
  if (rand > 0.2) return "Neutral";
  return "Negative";
}

function getRandomDate(): string {
  const days = Math.floor(Math.random() * 7) + 1; // 1-7 days ago
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDateRange(): string {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  
  return `${weekAgo.toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' })} - ${today.toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function formatReachNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// PDF generation function
export async function generatePDFFromCelebrities(selectedCelebrities: string[]) {
  if (!selectedCelebrities || selectedCelebrities.length === 0) throw new Error('No celebrities selected');
  // For now, use the first celebrity as the client and query
  const client = selectedCelebrities[0];
  const query = selectedCelebrities[0];
  // 1. Get MediaReport JSON from new API
  const reportRes = await fetch('/api/generate-media-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client, query }),
  });
  if (!reportRes.ok) {
    const err = await reportRes.text();
    throw new Error(`Failed to generate media report: ${err}`);
  }
  const report = await reportRes.json();
  // 2. Send MediaReport JSON to PDF generator
  const pdfRes = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (!pdfRes.ok) {
    const err = await pdfRes.text();
    throw new Error(`Failed to generate PDF: ${err}`);
  }
  const blob = await pdfRes.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${client}-media-report-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
} 