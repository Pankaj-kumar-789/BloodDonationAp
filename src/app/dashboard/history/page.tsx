import { History, Calendar, Droplet, CheckCircle2 } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
        <p className="text-gray-500 mt-1">Track your past donations and requests</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-primary-red flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Total Donations</h3>
            <p className="text-gray-500">You have helped save 3 lives!</p>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-red-100 hover:bg-red-50/50 transition-colors group cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">City Hospital, Sector 32</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> 12th October, 2025
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">1 Unit</div>
                <div className="text-sm text-primary-red font-medium">Whole Blood</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
