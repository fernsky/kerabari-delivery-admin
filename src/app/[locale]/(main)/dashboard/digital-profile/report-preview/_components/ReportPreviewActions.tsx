"use client";

export function ReportPreviewActions() {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => window.print()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        प्रिन्ट गर्नुहोस्
      </button>
      <button
        onClick={() => {
          const element = document.getElementById('printable-report');
          if (element) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>गढवा गाउँपालिका - पूर्ण प्रतिवेदन</title>
                    <style>
                      ${document.getElementById('print-styles')?.innerHTML || ''}
                    </style>
                  </head>
                  <body>
                    ${element.innerHTML}
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.focus();
              printWindow.print();
            }
          }
        }}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        PDF निर्यात गर्नुहोस्
      </button>
    </div>
  );
}
