import { NextResponse } from 'next/server';
import { pdfGenerator } from '../../../lib/pdf-generator';
import { MediaReport } from '../../../types/report';

// Sample data for testing with all professional features
const sampleData: MediaReport = {
  client: "Dua Lipa",
  summary: "Dua Lipa received significant media coverage today with 6 top-tier mentions across major entertainment outlets. The coverage was overwhelmingly positive, focusing on her upcoming album announcement and recent charity work. Notable highlights include a BBC exclusive interview and trending status on multiple social platforms. Total estimated reach of 15.2M demonstrates exceptional visibility across key demographics.",
  date: "March 15, 2024",
  date_range: "March 15-16, 2024",
  total_estimated_reach: 15200000,
  overall_sentiment: "Positive",
  articles: [
    {
      title: "Dua Lipa Announces Surprise Album at Wembley Stadium",
      source: "BBC Entertainment",
      tier: "Top Tier",
      coverage: "Headline",
      snippet: "In a stunning move that surprised fans worldwide, Dua Lipa announced her highly anticipated third studio album during her sold-out Wembley Stadium performance last night.",
      url: "https://bbc.co.uk/entertainment/dua-lipa-album-announcement",
      screenshot_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      estimated_reach: 8500000,
      sentiment: "Positive",
      date_published: "15 Mar 2024"
    },
    {
      title: "Chart-Topper Dua Lipa's Charity Initiative Gains Momentum", 
      source: "The Guardian",
      tier: "Top Tier",
      coverage: "Headline",
      snippet: "The pop star's foundation for music education in underserved communities has raised over £2 million in its first month, demonstrating her commitment to social causes.",
      url: "https://guardian.co.uk/music/dua-lipa-charity",
      screenshot_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
      estimated_reach: 4200000,
      sentiment: "Positive",
      date_published: "15 Mar 2024"
    },
    {
      title: "Celebrity Style: Dua Lipa's Fashion Week Moments",
      source: "Vogue UK", 
      tier: "Mid Tier",
      coverage: "Mention",
      snippet: "Among the standout celebrities at London Fashion Week, Dua Lipa made waves with her sustainable fashion choices and bold statement pieces.",
      url: "https://vogue.co.uk/fashion/dua-lipa-fashion-week",
      estimated_reach: 1800000,
      sentiment: "Positive",
      date_published: "14 Mar 2024"
    },
    {
      title: "Social Media Buzz: Dua Lipa Trends Again",
      source: "Entertainment Weekly",
      tier: "Low Tier", 
      coverage: "Mention",
      snippet: "The singer's latest Instagram post featuring behind-the-scenes studio footage has fans speculating about new music collaborations.",
      url: "https://ew.com/celebrity/dua-lipa-social-media",
      estimated_reach: 450000,
      sentiment: "Neutral",
      date_published: "16 Mar 2024"
    },
    {
      title: "Music Industry Insider: Dua Lipa's Strategic Career Moves",
      source: "Billboard",
      tier: "Top Tier",
      coverage: "Headline",
      snippet: "Industry experts praise Dua Lipa's calculated approach to album releases and brand partnerships, cementing her status as a savvy businesswoman beyond her musical talents.",
      url: "https://billboard.com/music/dua-lipa-career-strategy",
      estimated_reach: 2100000,
      sentiment: "Positive",
      date_published: "15 Mar 2024"
    },
    {
      title: "Concert Review: Mixed Reception for New Songs",
      source: "NME",
      tier: "Mid Tier",
      coverage: "Mention",
      snippet: "While fans were thrilled by the surprise announcement, some critics noted that the new material needs more development before the album release.",
      url: "https://nme.com/reviews/dua-lipa-wembley-review",
      estimated_reach: 680000,
      sentiment: "Negative",
      date_published: "16 Mar 2024"
    }
  ]
};

export async function GET() {
  try {
    console.log('Test PDF generation request received');
    console.log('Sample data:', { client: sampleData.client, articleCount: sampleData.articles.length });
    
    const pdfBuffer = await pdfGenerator.generatePDF(sampleData);
    console.log('Test PDF generated successfully, size:', pdfBuffer.length);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-media-report.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Test PDF generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json({ 
      error: 'Failed to generate test PDF',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
} 