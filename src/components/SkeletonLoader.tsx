export function DonorCardSkeleton() {
  return (
    <div className="border rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-white border-gray-100 flex flex-col justify-between min-h-[140px] animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded-md w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-md w-24"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 mt-4">
        <div className="h-4 bg-gray-200 rounded-md w-12"></div>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <div className="h-4 bg-gray-200 rounded-md w-24"></div>
      </div>
      
      <div className="md:hidden">
        <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export function BloodBankCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden animate-pulse">
      <div className="p-6 border-b bg-gray-50/50 border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 shrink-0"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded-md w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded-md w-20"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-5"></div>
        
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded-md w-32 mb-3"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
