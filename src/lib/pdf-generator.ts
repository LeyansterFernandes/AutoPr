import puppeteer from 'puppeteer';
import { MediaReport, PDFGenerationOptions } from '../types/report';
import { generateReportHTML } from '../templates/report-template';

export class PDFGenerator {
  private static instance: PDFGenerator;
  
  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  async generatePDF(
    reportData: MediaReport, 
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    console.log('PDFGenerator: Starting browser launch...');
    
    const browser = await puppeteer.launch({
      headless: true
    });

    try {
      console.log('PDFGenerator: Browser launched, creating page...');
      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 800 });
      
      console.log('PDFGenerator: Generating HTML...');
      // Generate HTML from template
      const html = generateReportHTML(reportData);
      console.log('PDFGenerator: HTML generated, length:', html.length);
      
      console.log('PDFGenerator: Setting page content...');
      // Set content and wait for images to load
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'] 
      });

      console.log('PDFGenerator: Generating PDF...');
      // Generate PDF with professional settings
      const pdf = await page.pdf({
        format: options.format || 'A4',
        margin: options.margin || {
          top: '1in',
          right: '0.75in',
          bottom: '1in',
          left: '0.75in'
        },
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: options.displayHeaderFooter || false,
        headerTemplate: options.headerTemplate || '',
        footerTemplate: options.footerTemplate || '',
      });

      console.log('PDFGenerator: PDF generated successfully, size:', pdf.length);
      return Buffer.from(pdf);
    } catch (error) {
      console.error('PDFGenerator: Error during generation:', error);
      throw error;
    } finally {
      console.log('PDFGenerator: Closing browser...');
      await browser.close();
      console.log('PDFGenerator: Browser closed');
    }
  }

  async generatePDFFromHTML(html: string, options: PDFGenerationOptions = {}): Promise<Buffer> {
    console.log('PDFGenerator: Starting HTML-to-PDF conversion...');
    
    const browser = await puppeteer.launch({
      headless: true
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'] 
      });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        margin: options.margin || {
          top: '1in',
          right: '0.75in', 
          bottom: '1in',
          left: '0.75in'
        },
        printBackground: true,
        preferCSSPageSize: true,
      });

      console.log('PDFGenerator: HTML-to-PDF completed, size:', pdf.length);
      return Buffer.from(pdf);
    } catch (error) {
      console.error('PDFGenerator: Error during HTML conversion:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

export const pdfGenerator = PDFGenerator.getInstance(); 