import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function AppointmentsPage() {
  return (
    <PageTransition className="max-w-5xl mx-auto space-y-6 mt-4 pb-10">
      <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="mb-8">
          <h1 className="text-3xl md:text-[2rem] font-black text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-500 max-w-lg font-medium text-[15px]">Manage your upcoming blood donation appointments.</p>
        </div>

        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <Calendar className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Appointments Scheduled</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto font-medium leading-relaxed">
            You don't have any upcoming blood donation appointments at the moment. 
            When you schedule a donation at a local drive or hospital, it will appear here.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/dashboard" className="inline-block bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl text-[14px] transition-colors shadow-sm">
               Go Back
            </Link>
            <Link href="/dashboard/requests" className="inline-block bg-primary-red hover:bg-red-800 text-white font-bold py-3 px-8 rounded-xl text-[14px] transition-colors shadow-sm">
               Find a Drive
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
