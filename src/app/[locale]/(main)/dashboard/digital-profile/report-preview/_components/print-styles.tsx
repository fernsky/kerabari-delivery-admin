'use client'

export function PrintStyles() {
  return (
    <style id="print-styles" dangerouslySetInnerHTML={{
      __html: `
      /* ========================================
         BUDDHA SHANTI MUNICIPALITY PDF REPORT STYLES
         Clean, consolidated CSS for PDF generation
         Optimized for A4 paper printing
         ======================================== */

      /* Global white background enforcement */
      html, body, #printable-report, #printable-report * {
        background: white !important;
        background-color: white !important;
      }

      /* Custom Nepali counter style */
      @counter-style nepali-numerals {
        system: numeric;
        symbols: "०" "१" "२" "३" "४" "५" "६" "७" "८" "९";
        suffix: "";
      }

      /* ========================================
         PAGE SETUP AND COUNTERS
         ======================================== */

      @page {
        size: A4;
        margin: 2cm 1.5cm 2cm 1.5cm;
        background: white;

        @bottom-right {
          content: counter(page, nepali-numerals) " | बुद्धशान्ति गाउँपालिका पार्श्वचित्र, २०८१";
          font-size: 9pt;
          color: #666;
          font-family: "Noto Sans Devanagari", "DejaVu Sans", sans-serif;
        }

        @top-right {
          content: "बुद्धशान्ति गाउँपालिका पार्श्वचित्र, २०८१";
          font-size: 9pt;
          color: #666;
          font-family: "Noto Sans Devanagari", "DejaVu Sans", sans-serif;
        }
      }

      /* Cover page - no page numbers */
      @page :first {
        @top-left { content: ""; }
        @top-right { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }

      /* ========================================
         BASE TYPOGRAPHY AND LAYOUT
         ======================================== */

      .report-document {
        font-family: "Noto Sans Devanagari", "DejaVu Sans", sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #333;
        margin: 0;
        padding: 0;
        background: white !important;
        background-color: white !important;
      }

      .report-document * {
        background: white !important;
        background-color: white !important;
      }

      .report-document p {
        margin: 0.4em 0;
        text-align: justify;
        orphans: 2;
        widows: 2;
        background: white !important;
        background-color: white !important;
      }

      .report-document h1,
      .report-document h2,
      .report-document h3,
      .report-document h4,
      .report-document h5,
      .report-document h6 {
        page-break-after: auto;
        page-break-inside: auto;
        margin: 0.5em 0;
        background: white !important;
        background-color: white !important;
      }

      .report-document h1 { font-size: 18pt; }
      .report-document h2 { font-size: 16pt; }
      .report-document h3 { font-size: 14pt; }
      .report-document h4 { font-size: 12pt; }
      .report-document h5,
      .report-document h6 { font-size: 11pt; }

      .report-document ul,
      .report-document ol {
        margin: 0.4em 0 0.8em 0;
        padding-left: 1.2em;
        background: white !important;
        background-color: white !important;
      }

      .report-document li {
        margin-bottom: 0.2em;
        background: white !important;
        background-color: white !important;
      }

      /* ========================================
         PAGE STRUCTURE AND BREAKS
         ======================================== */

      .cover-page {
        page-break-after: always;
        text-align: center;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: white !important;
        background-color: white !important;
      }

      .toc-page {
        page-break-before: always;
        page-break-after: always;
        background: white !important;
        background-color: white !important;
      }

      .main-content-start {
        page-break-before: always;
        background: white !important;
        background-color: white !important;
      }

      .category-break {
        page-break-before: always;
        page-break-after: auto;
        page-break-inside: auto;
        break-before: page;
        margin-top: 0;
        margin-bottom: 0;
        background: white !important;
        background-color: white !important;
      }

      .main-content-start .category-break:first-child {
        page-break-before: auto;
      }

      .section-content {
        margin-top: 1em;
        margin-bottom: 0;
        background: white !important;
        background-color: white !important;
      }

      .section-within-category {
        margin-top: 1.5em;
        margin-bottom: 0;
        background: white !important;
        background-color: white !important;
      }

      /* ========================================
         CATEGORY AND SECTION STYLING
         ======================================== */

      .category-title {
        font-size: 18pt;
        font-weight: 700;
        text-align: center;
        color: #dc2626;
        margin: 0.5em 0 1.5em 0;
        padding: 0.3em;
        page-break-after: auto;
        page-break-before: avoid;
        background: white !important;
        background-color: white !important;
      }

      .section-header.level-2 {
        font-size: 16pt;
        color: #1e40af;
        border-bottom: 2px solid #0ea5e9;
        padding-bottom: 0.2em;
        margin-top: 1.5em;
        margin-bottom: 0.8em;
        page-break-after: auto;
        background: white !important;
        background-color: white !important;
      }

      .section-header.level-3 {
        font-size: 14pt;
        color: #1e40af;
        border-bottom: 1px solid #0ea5e9;
        padding-bottom: 0.15em;
        margin-top: 1.2em;
        margin-bottom: 0.6em;
        page-break-after: auto;
        background: white !important;
        background-color: white !important;
      }

      .section-header.level-4 {
        font-size: 12pt;
        color: #1e40af;
        font-weight: 600;
        margin-top: 1em;
        margin-bottom: 0.5em;
        background: white !important;
        background-color: white !important;
      }

      .content-section {
        margin-bottom: 1em;
        page-break-inside: auto;
        background: white !important;
        background-color: white !important;
      }

      .content-paragraph {
        font-size: 11pt;
        line-height: 1.5;
        margin-bottom: 1em;
        text-align: justify;
        background: white !important;
        background-color: white !important;
      }

      .content-paragraph p {
        margin-bottom: 0.8em;
        text-indent: 1.2em;
        background: white !important;
        background-color: white !important;
      }

      /* ========================================
         TABLE OF CONTENTS
         ======================================== */

      .toc-title {
        font-size: 20pt;
        font-weight: 700;
        text-align: center;
        color: #1e3a8a;
        margin-bottom: 1.5em;
        padding-bottom: 0.4em;
        background: white !important;
        background-color: white !important;
      }

      .toc-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4em;
        line-height: 1.3;
        background: white !important;
        background-color: white !important;
      }

      .toc-item .toc-link {
        flex: 1;
        padding-right: 1em;
        background: white !important;
        background-color: white !important;
      }

      .toc-item.level-1 {
        font-weight: 700;
        font-size: 12pt;
        margin-top: 0.8em;
        margin-bottom: 0.6em;
        color: #1e40af;
        background: white !important;
        background-color: white !important;
      }

      .toc-item.level-2 {
        font-weight: 600;
        margin-left: 1em;
        color: #374151;
        background: white !important;
        background-color: white !important;
      }

      .toc-item.level-3 {
        margin-left: 2em;
        color: #6b7280;
        background: white !important;
        background-color: white !important;
      }

      .toc-item.level-4 {
        margin-left: 3em;
        font-size: 10pt;
        color: #9ca3af;
        background: white !important;
        background-color: white !important;
      }

      .page-ref {
        font-weight: normal;
        color: #6b7280;
        min-width: 2em;
        text-align: right;
        background: white !important;
        background-color: white !important;
      }

      /* ========================================
         TABLES AND DATA PRESENTATION
         ======================================== */

      .data-table,
      .pdf-data-table,
      .demographic-summary-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0.8em 0;
        font-size: 9pt;
        page-break-inside: auto;
        background: white !important;
        background-color: white !important;
      }

      .data-table th,
      .data-table td,
      .pdf-data-table th,
      .pdf-data-table td,
      .demographic-summary-table th,
      .demographic-summary-table td {
        border: 1px solid #333;
        padding: 3px 5px;
        vertical-align: top;
        background: white !important;
        background-color: white !important;
      }

      .data-table th,
      .pdf-data-table th,
      .demographic-summary-table th {
        background-color: white !important;
        font-weight: bold;
        text-align: center;
        color: #1e40af;
      }

      .data-table tr:nth-child(even) td,
      .pdf-data-table tbody tr:nth-child(even) td,
      .demographic-summary-table tbody tr:nth-child(even) td {
        background-color: white !important;
      }

      .demographic-summary-table td:first-child {
        text-align: left;
        font-weight: normal;
        background: white !important;
        background-color: white !important;
      }

      .demographic-summary-table td:nth-child(2),
      .demographic-summary-table td:nth-child(3) {
        text-align: right;
        font-weight: bold;
        background: white !important;
        background-color: white !important;
      }

      .age-group-header td {
        background-color: white !important;
        font-weight: bold;
        text-align: center;
      }

      .total-row td {
        background-color: white !important;
        font-weight: bold;
      }

      .total-label {
        background-color: white !important;
        font-weight: bold;
        text-align: center;
      }

      .total-cell {
        background-color: white !important;
        font-weight: bold;
      }

      .grand-total-cell {
        background-color: white !important;
        font-weight: bold;
        color: #5b21b6;
      }

      /* ========================================
         CHARTS AND FIGURES - OPTIMIZED FOR A4
         ======================================== */

      .chart-section {
        margin-bottom: 1em;
        page-break-inside: avoid;
        text-align: center;
        background: white !important;
        background-color: white !important;
      }

      .chart-title,
      .table-title {
        font-size: 11pt;
        font-weight: bold;
        color: #1e40af;
        margin: 0.8em 0 0.4em 0;
        text-align: center;
        background: white !important;
        background-color: white !important;
      }

      .pdf-chart-container {
        border: none;
        text-align: center;
        margin: 0.5em 0;
        page-break-inside: auto;
        background: white !important;
        background-color: white !important;
        padding: 0;
      }

      .pdf-chart-container svg {
        max-width: 100%;
        height: auto;
        border: none;
        background: white !important;
        background-color: white !important;
      }

      .pdf-chart-image {
        max-width: 100%;
        height: auto;
        border: none;
        background: white !important;
        background-color: white !important;
      }

      .table-section {
        margin-bottom: 1em;
        page-break-inside: auto;
        background: white !important;
        background-color: white !important;
      }

      /* ========================================
         UTILITY CLASSES
         ======================================== */

      .text-center { text-align: center; background: white !important; background-color: white !important; }
      .text-right { text-align: right; background: white !important; background-color: white !important; }
      .text-muted { color: #6b7280; background: white !important; background-color: white !important; }
      .font-weight-bold { font-weight: bold; background: white !important; background-color: white !important; }

      .mt-1 { margin-top: 0.2em; background: white !important; background-color: white !important; }
      .mt-2 { margin-top: 0.4em; background: white !important; background-color: white !important; }
      .mt-3 { margin-top: 0.8em; background: white !important; background-color: white !important; }
      .mb-1 { margin-bottom: 0.2em; background: white !important; background-color: white !important; }
      .mb-2 { margin-bottom: 0.4em; background: white !important; background-color: white !important; }
      .mb-3 { margin-bottom: 0.8em; background: white !important; background-color: white !important; }

      /* ========================================
         PRINT MEDIA QUERIES
         ======================================== */

      @media print {
        .print\\:hidden {
          display: none !important;
        }

        * {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          background: white !important;
          background-color: white !important;
        }

        body, html {
          background: white !important;
          background-color: white !important;
        }

        .report-document,
        .report-document * {
          background: white !important;
          background-color: white !important;
        }

        .pdf-data-table,
        .demographic-summary-table {
          font-size: 8pt;
          background: white !important;
          background-color: white !important;
        }

        .pdf-data-table tr,
        .demographic-summary-table tr {
          page-break-inside: avoid;
          background: white !important;
          background-color: white !important;
        }

        .pdf-data-table td,
        .pdf-data-table th,
        .demographic-summary-table td,
        .demographic-summary-table th {
          background: white !important;
          background-color: white !important;
        }

        .chart-section {
          page-break-inside: avoid;
          margin-bottom: 0.8em;
          background: white !important;
          background-color: white !important;
        }

        .table-section {
          page-break-inside: avoid;
          margin-bottom: 0.8em;
          background: white !important;
          background-color: white !important;
        }

        /* Remove any backgrounds from charts */
        .pdf-chart-container,
        .pdf-chart-container svg,
        .pdf-chart-image {
          background: white !important;
          background-color: white !important;
        }

        /* Optimize spacing for print */
        .section-content {
          margin-top: 0.8em;
          background: white !important;
          background-color: white !important;
        }

        .section-within-category {
          margin-top: 1.2em;
          background: white !important;
          background-color: white !important;
        }

        .content-section {
          margin-bottom: 0.8em;
          background: white !important;
          background-color: white !important;
        }
      }

      /* ========================================
         RESPONSIVE ADJUSTMENTS
         ======================================== */

      @media screen {
        .report-document {
          max-width: 210mm;
          margin: 0 auto;
          background: white !important;
          background-color: white !important;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 1.5cm;
        }

        .report-document * {
          background: white !important;
          background-color: white !important;
        }
      }
    `}} />
  );
} 