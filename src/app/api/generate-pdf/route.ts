import { NextRequest, NextResponse } from 'next/server';
import { pdfGenerator } from '../../../lib/pdf-generator';
import { MediaReport } from '../../../types/report';

export async function POST(request: NextRequest) {
  try {
    console.log('PDF generation request received');
    
    const reportData: MediaReport = await request.json();
    console.log('Report data:', { client: reportData.client, articleCount: reportData.articles?.length });
    
    // Validate required fields
    if (!reportData.client || !reportData.summary || !reportData.articles) {
      console.error('Missing required fields:', { 
        hasClient: !!reportData.client, 
        hasSummary: !!reportData.summary, 
        hasArticles: !!reportData.articles 
      });
      return NextResponse.json(
        { error: 'Missing required fields: client, summary, or articles' },
        { status: 400 }
      );
    }

    console.log('Starting PDF generation...');
    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF(reportData);
    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${reportData.client.replace(/[^a-zA-Z0-9]/g, '-')}-media-report-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
} 