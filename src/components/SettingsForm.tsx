"use client";

import { useState, useRef } from "react";
import { Camera, User as UserIcon, Loader2 } from "lucide-react";
import { updateProfileAction } from "@/app/actions/user";

export function SettingsForm({ user, profile }: { user: any, profile: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Profile updated successfully!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Image Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md transition-all">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 transition-colors" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageChange} 
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">Profile Picture</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Upload a high-res image. Max size 5MB.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-colors">{error}</div>}
      {success && <div className="p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium transition-colors">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md transition-all">
          <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-slate-800 pb-4 transition-colors">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Full Name</label>
            <input type="text" name="name" defaultValue={user.name} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email Address</label>
            <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed transition-colors" />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Phone Number</label>
            <input type="tel" name="phone" defaultValue={user.phone || ""} placeholder="e.g. +91 9876543210" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
          </div>
        </div>

        {/* Role Specific Info */}
        {(user.role === "DONOR" || user.role === "HOSPITAL" || user.role === "BLOOD_BANK") && (
          <div className="space-y-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-950/20 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 transition-colors"></div>
            <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-slate-800 pb-4 relative z-10 transition-colors">
              {user.role === "DONOR" ? "Donor Details" : user.role === "HOSPITAL" ? "Hospital Details" : "Blood Bank Details"}
            </h3>
            
            {user.role === "DONOR" && (
              <>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Blood Group</label>
                    <select name="bloodGroup" defaultValue={profile?.bloodGroup || "A_POS"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors">
                      <option value="A_POS">A+</option>
                      <option value="A_NEG">A-</option>
                      <option value="B_POS">B+</option>
                      <option value="B_NEG">B-</option>
                      <option value="O_POS">O+</option>
                      <option value="O_NEG">O-</option>
                      <option value="AB_POS">AB+</option>
                      <option value="AB_NEG">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Donation Fee (₹)</label>
                    <input type="number" name="contactFee" defaultValue={profile?.contactFee || 0} min="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Amount you request as a reward for donating blood.</p>
                  </div>
                </div>

                <div className="relative z-10 p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl mt-4 transition-colors">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Willing to Donate</h4>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="donationTypes" value="BLOOD" defaultChecked={profile?.donationTypes?.includes("BLOOD") ?? true} className="w-4 h-4 text-primary-red focus:ring-primary-red rounded border-gray-300" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Blood</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="donationTypes" value="PLATELETS" defaultChecked={profile?.donationTypes?.includes("PLATELETS")} className="w-4 h-4 text-primary-red focus:ring-primary-red rounded border-gray-300" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Platelets</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="donationTypes" value="PLASMA" defaultChecked={profile?.donationTypes?.includes("PLASMA")} className="w-4 h-4 text-primary-red focus:ring-primary-red rounded border-gray-300" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Plasma</span>
                    </label>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl mt-4 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Available to Donate</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Turn this off if you are temporarily unavailable (e.g., recently donated, on vacation).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isAvailable" defaultChecked={profile?.isAvailable ?? true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-red"></div>
                  </label>
                </div>
              </>
            )}

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">City</label>
                <input type="text" name="city" defaultValue={profile?.city || ""} placeholder="e.g. Mumbai" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">State</label>
                <input type="text" name="state" defaultValue={profile?.state || ""} placeholder="e.g. Maharashtra" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-colors" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary-red hover:bg-red-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-md shadow-red-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
