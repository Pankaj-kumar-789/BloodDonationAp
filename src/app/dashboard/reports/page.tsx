import { auth } from "@/auth";
import Link from "next/link";
import { ArrowLeft, Download, FileText, PieChart } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Analytics & Reports</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg transition-colors">Generate detailed reports of your blood bank operations and download them for your records.</p>
          </div>
          <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md dark:shadow-none">
            <Download className="w-4 h-4" /> Export All Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 flex items-start gap-4 hover:border-gray-300 dark:hover:border-slate-600 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex items-center justify-center shadow-sm border border-gray-200 dark:border-slate-700 group-hover:scale-105 transition-all shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 transition-colors">Monthly Inventory Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">Detailed breakdown of blood units collected and issued in the last 30 days.</p>
              <span className="text-sm font-bold text-primary-red dark:text-red-400 transition-colors">Download PDF</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 flex items-start gap-4 hover:border-gray-300 dark:hover:border-slate-600 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex items-center justify-center shadow-sm border border-gray-200 dark:border-slate-700 group-hover:scale-105 transition-all shrink-0">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 transition-colors">Blood Request Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">Analytics on request fulfillment rates and emergency response times.</p>
              <span className="text-sm font-bold text-primary-red dark:text-red-400 transition-colors">Download CSV</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center py-16 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl transition-colors">
           <p className="text-gray-400 dark:text-gray-500 font-medium transition-colors">Advanced charting features are coming in the next update.</p>
        </div>
      </div>
    </div>
  );
}
