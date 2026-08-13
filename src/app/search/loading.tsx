import { DonorCardSkeleton } from "@/components/SkeletonLoader";

export default function SearchLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
      {/* Header Skeleton */}
      <div className="px-4 py-6 sm:px-6 lg:px-8 bg-white border-b border-gray-100 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-6xl mx-auto w-full">
          <div>
            <div className="h-10 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-md w-64 animate-pulse"></div>
          </div>
          <div className="w-full md:w-64 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
      
      {/* Split Pane Skeleton */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-6xl mx-auto w-full">
        {/* Left Pane */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded-md w-32 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <DonorCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        {/* Right Pane (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 bg-gray-50 flex-col items-center justify-center p-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mb-6"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-48 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
