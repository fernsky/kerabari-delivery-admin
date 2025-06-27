import { PrintableReport } from "./_components/printable-report";
import { ReportPreviewActions } from "./_components/ReportPreviewActions";

export default function ReportPreviewPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            डिजिटल प्रोफाइल प्रतिवेदन पूर्वावलोकन
          </h1>
          <p className="mt-2 text-gray-600">
            यो पृष्ठमा बुद्धशान्ति गाउँपालिकाको डिजिटल प्रोफाइल प्रतिवेदनको पूर्वावलोकन हेर्न सकिन्छ।
          </p>
        </div>
        <ReportPreviewActions />
      </div>

      <PrintableReport />
    </div>
  );
}