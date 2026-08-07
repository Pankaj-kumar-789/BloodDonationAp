"use client";

import { useState } from "react";
import { toggleAvailabilityAction } from "@/app/actions/user";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AvailabilityToggleClient({ initialIsAvailable }: { initialIsAvailable: boolean }) {
  const [isAvailable, setIsAvailable] = useState(initialIsAvailable);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const newState = !isAvailable;
    setIsAvailable(newState); // Optimistic UI update
    setIsLoading(true);

    const result = await toggleAvailabilityAction(newState);
    if (!result.success) {
      // Revert if failed
      setIsAvailable(!newState);
    }
    
    setIsLoading(false);
    router.refresh();
  };

  return (
    <label className={`relative inline-flex items-center ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={isAvailable} 
        onChange={handleToggle}
        disabled={isLoading}
      />
      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success-green shadow-inner">
      </div>
      {isLoading && <Loader2 className="absolute -left-6 w-4 h-4 animate-spin text-gray-400" />}
    </label>
  );
}
