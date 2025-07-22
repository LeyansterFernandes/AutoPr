# AutoPr Media Report Generator

## Overview

AutoPr is a full-stack application that automates the generation of professional media coverage reports. It scrapes Google News for articles about a client or topic, analyzes and summarizes the results, and produces a polished PDF report with analytics, executive summary, and article images.

---

## Features
- **Google News Scraper:** Pulls real-time articles (headline, body, source, date, image, URL) for a given query.
- **Media Analyst Agent:** Tags each article with tier, coverage type, sentiment, and reach (mocked or AI-ready).
- **Copy Editor Agent:** Generates an executive summary from all articles (AI-ready, currently rule-based).
- **PDF Report Generator:** Produces a branded, styled PDF with analytics, summary, and article images.
- **Modern Next.js Frontend:** Select a celebrity/client, generate, and download reports with one click.

---

## Architecture

```mermaid
graph TD;
    A[User/Frontend] -->|Selects client, clicks Generate| B[API: /api/generate-media-report];
    B -->|Scrapes Google News| C[Pipeline: Scraper];
    C --> D[Media Analyst Agent];
    D --> E[Copy Editor Agent];
    E --> F[MediaReport JSON];
    F -->|POST| G[API: /api/generate-pdf];
    G --> H[PDF Generator (Puppeteer)];
    H --> I[PDF Download];
```

- **Frontend:** Next.js React app (TypeScript, Tailwind CSS)
- **Backend:** Next.js API routes (TypeScript)
- **Pipeline:** Orchestrated in `src/pipeline/generateMediaReport.ts`
- **PDF Generation:** Puppeteer renders HTML from `src/templates/report-template.ts`

---

## Setup & Local Development

### Prerequisites
- Node.js 18+
- npm
- (For PDF generation) Chromium dependencies (Puppeteer downloads automatically)

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Generate a report (CLI)
```bash
npx tsx src/pipeline/generateMediaReport.ts "Client Name" "search term"
# Output: src/pipeline/media-report.json
```

### Generate a report (Web UI)
- Start the dev server
- Go to [http://localhost:3000](http://localhost:3000)
- Select a celebrity/client and click **Generate Report**
- The app will scrape Google News, generate a summary, and download a PDF

---

## Extensibility
- **AI Integration:** Swap in Google Vertex AI, OpenAI, or other LLMs for smarter summaries and tagging.
- **Custom Templates:** Edit `src/templates/report-template.ts` for branding or layout changes.
- **Additional Sources:** Add more scrapers for Bing News, Twitter, etc.
- **Multi-client Reports:** Extend the pipeline to support batch/multi-client reporting.

---

## Troubleshooting
- **PDF Generation Fails:** Ensure Puppeteer can launch Chromium (see Puppeteer docs for OS-specific dependencies).
- **Google News Scraping Fails:** Google may block bots; try adjusting user-agent or scraping logic.
- **Serverless Deployments:** Puppeteer may not work on Vercel/Netlify without extra setup (see chrome-aws-lambda).

---

## License
MIT
