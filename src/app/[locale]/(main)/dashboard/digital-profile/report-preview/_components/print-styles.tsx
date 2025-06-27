'use client'

export function PrintStyles() {
  return (
    <style id="print-styles" dangerouslySetInnerHTML={{
      __html: `
      /* ========================================
         BUDDHA SHANTI MUNICIPALITY PDF REPORT STYLES
         Clean, consolidated CSS for PDF generation
         ======================================== */

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
        margin: 2.5cm 2cm 2cm 2cm;

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
        line-height: 1.5;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .report-document p {
        margin: 0.5em 0;
        text-align: justify;
        orphans: 2;
        widows: 2;
      }

      .report-document h1,
      .report-document h2,
      .report-document h3,
      .report-document h4,
      .report-document h5,
      .report-document h6 {
        page-break-after: auto;
        page-break-inside: auto;
      }

      .report-document h1 { font-size: 18pt; }
      .report-document h2 { font-size: 16pt; }
      .report-document h3 { font-size: 14pt; }
      .report-document h4 { font-size: 12pt; }
      .report-document h5,
      .report-document h6 { font-size: 11pt; }

      .report-document ul,
      .report-document ol {
        margin: 0.5em 0 1em 0;
        padding-left: 1.5em;
      }

      .report-document li {
        margin-bottom: 0.3em;
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
      }

      .toc-page {
        page-break-before: always;
        page-break-after: always;
      }

      .main-content-start {
        page-break-before: always;
      }

      .category-break {
        page-break-before: always;
        page-break-after: auto;
        page-break-inside: auto;
        break-before: page;
      }

      .main-content-start .category-break:first-child {
        page-break-before: auto;
      }

      .section-content {
        margin-top: 1.5em;
      }

      .section-within-category {
        margin-top: 2em;
      }

      /* ========================================
         CATEGORY AND SECTION STYLING
         ======================================== */

      .category-title {
        font-size: 18pt;
        font-weight: 700;
        text-align: center;
        color: #dc2626;
        margin: 1em 0 2em 0;
        padding: 0.5em;
        page-break-after: auto;
        page-break-before: avoid;
      }

      .section-header.level-2 {
        font-size: 16pt;
        color: #1e40af;
        border-bottom: 2px solid #0ea5e9;
        padding-bottom: 0.3em;
        margin-top: 2em;
        margin-bottom: 1em;
        page-break-after: auto;
      }

      .section-header.level-3 {
        font-size: 14pt;
        color: #1e40af;
        border-bottom: 1px solid #0ea5e9;
        padding-bottom: 0.2em;
        margin-top: 1.5em;
        margin-bottom: 0.8em;
        page-break-after: auto;
      }

      .section-header.level-4 {
        font-size: 12pt;
        color: #1e40af;
        font-weight: 600;
        margin-top: 1.2em;
        margin-bottom: 0.6em;
      }

      .content-section {
        margin-bottom: 1.5em;
        page-break-inside: auto;
      }

      .content-paragraph {
        font-size: 11pt;
        line-height: 1.6;
        margin-bottom: 1.5em;
        text-align: justify;
      }

      .content-paragraph p {
        margin-bottom: 1em;
        text-indent: 1.5em;
      }

      /* ========================================
         TABLE OF CONTENTS
         ======================================== */

      .toc-title {
        font-size: 20pt;
        font-weight: 700;
        text-align: center;
        color: #1e3a8a;
        margin-bottom: 2em;
        padding-bottom: 0.5em;
      }

      .toc-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5em;
        line-height: 1.4;
      }

      .toc-item .toc-link {
        flex: 1;
        padding-right: 1em;
      }

      .toc-item.level-1 {
        font-weight: 700;
        font-size: 12pt;
        margin-top: 1em;
        margin-bottom: 0.8em;
        color: #1e40af;
      }

      .toc-item.level-2 {
        font-weight: 600;
        margin-left: 1em;
        color: #374151;
      }

      .toc-item.level-3 {
        margin-left: 2em;
        color: #6b7280;
      }

      .toc-item.level-4 {
        margin-left: 3em;
        font-size: 10pt;
        color: #9ca3af;
      }

      .page-ref {
        font-weight: normal;
        color: #6b7280;
        min-width: 2em;
        text-align: right;
      }

      /* ========================================
         TABLES AND DATA PRESENTATION
         ======================================== */

      .data-table,
      .pdf-data-table,
      .demographic-summary-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        font-size: 9pt;
        page-break-inside: auto;
      }

      .data-table th,
      .data-table td,
      .pdf-data-table th,
      .pdf-data-table td,
      .demographic-summary-table th,
      .demographic-summary-table td {
        border: 1px solid #333;
        padding: 4px 6px;
        vertical-align: top;
      }

      .data-table th,
      .pdf-data-table th,
      .demographic-summary-table th {
        background-color: #f8fafc;
        font-weight: bold;
        text-align: center;
        color: #1e40af;
      }

      .data-table tr:nth-child(even) td,
      .pdf-data-table tbody tr:nth-child(even) td,
      .demographic-summary-table tbody tr:nth-child(even) td {
        background-color: #f9fafb;
      }

      .demographic-summary-table td:first-child {
        text-align: left;
        font-weight: normal;
      }

      .demographic-summary-table td:nth-child(2),
      .demographic-summary-table td:nth-child(3) {
        text-align: right;
        font-weight: bold;
      }

      .age-group-header td {
        background-color: #f5f5f5 !important;
        font-weight: bold;
        text-align: center;
      }

      .total-row td {
        background-color: #e2e8f0 !important;
        font-weight: bold;
      }

      .total-label {
        background-color: #cbd5e1 !important;
        font-weight: bold;
        text-align: center;
      }

      .total-cell {
        background-color: #f1f5f9 !important;
        font-weight: bold;
      }

      .grand-total-cell {
        background-color: #ddd6fe !important;
        font-weight: bold;
        color: #5b21b6;
      }

      /* ========================================
         CHARTS AND FIGURES
         ======================================== */

      .chart-section {
        margin-bottom: 1.5em;
        page-break-inside: avoid;
      }

      .chart-title,
      .table-title {
        font-size: 12pt;
        font-weight: bold;
        color: #1e40af;
        margin: 1em 0 0.5em 0;
        text-align: center;
      }

      .pdf-chart-container {
        border: none;
        text-align: center;
        margin: 1em 0;
        page-break-inside: auto;
      }

      .pdf-chart-image {
        max-width: 100%;
        height: auto;
        border: none;
      }

      .table-section {
        margin-bottom: 1.5em;
        page-break-inside: auto;
      }

      /* ========================================
         UTILITY CLASSES
         ======================================== */

      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-muted { color: #6b7280; }
      .font-weight-bold { font-weight: bold; }

      .mt-1 { margin-top: 0.25em; }
      .mt-2 { margin-top: 0.5em; }
      .mt-3 { margin-top: 1em; }
      .mb-1 { margin-bottom: 0.25em; }
      .mb-2 { margin-bottom: 0.5em; }
      .mb-3 { margin-bottom: 1em; }

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
        }

        .pdf-data-table,
        .demographic-summary-table {
          font-size: 8pt;
        }

        .pdf-data-table tr,
        .demographic-summary-table tr {
          page-break-inside: avoid;
        }

        .chart-section {
          page-break-inside: avoid;
        }

        .table-section {
          page-break-inside: avoid;
        }
      }

      /* ========================================
         RESPONSIVE ADJUSTMENTS
         ======================================== */

      @media screen {
        .report-document {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 2cm;
        }
      }
    `}} />
  );
} 