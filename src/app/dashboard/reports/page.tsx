import { auth } from "@/auth";
import Link from "next/link";
import { ArrowLeft, Download, FileText, PieChart } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-500 max-w-lg">Generate detailed reports of your blood bank operations and download them for your records.</p>
          </div>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md">
            <Download className="w-4 h-4" /> Export All Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4 hover:border-gray-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white text-gray-900 flex items-center justify-center shadow-sm border border-gray-200 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Monthly Inventory Report</h3>
              <p className="text-sm text-gray-500 mb-3">Detailed breakdown of blood units collected and issued in the last 30 days.</p>
              <span className="text-sm font-bold text-primary-red">Download PDF</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4 hover:border-gray-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white text-gray-900 flex items-center justify-center shadow-sm border border-gray-200 group-hover:scale-105 transition-transform shrink-0">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Blood Request Analytics</h3>
              <p className="text-sm text-gray-500 mb-3">Analytics on request fulfillment rates and emergency response times.</p>
              <span className="text-sm font-bold text-primary-red">Download CSV</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
           <p className="text-gray-400 font-medium">Advanced charting features are coming in the next update.</p>
        </div>
      </div>
    </div>
  );
}
