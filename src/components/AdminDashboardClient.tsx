"use client";

import { Users, Activity, CreditCard, ShieldCheck, CheckCircle2, Loader2, Building2, AlertTriangle, Stethoscope, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { verifyOrganizationAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import PageTransition from "@/components/PageTransition";
import { motion, Variants } from "framer-motion";

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminDashboardClient({ stats }: { stats: any }) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [orgToVerify, setOrgToVerify] = useState<any>(null);
  const router = useRouter();

  const handleVerifyClick = (org: any) => {
    setOrgToVerify(org);
    setShowVerifyModal(true);
  };

  const confirmVerification = async () => {
    if (!orgToVerify) return;
    
    setVerifyingId(orgToVerify.id);
    await verifyOrganizationAction(orgToVerify.id, orgToVerify.type);
    setVerifyingId(null);
    setShowVerifyModal(false);
    setOrgToVerify(null);
    router.refresh();
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">Export Report</button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Total Users Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-blue-100 font-medium">Total Users</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.totalUsers?.toLocaleString() || 0}</h3>
            <p className="text-sm text-blue-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Platform</span> Active
            </p>
          </div>
        </motion.div>

        {/* Registered Donors Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-emerald-100 font-medium">Registered Donors</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.totalDonors?.toLocaleString() || 0}</h3>
            <p className="text-sm text-emerald-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Ready</span> to donate
            </p>
          </div>
        </motion.div>

        {/* Verified Blood Banks */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-cyan-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Building className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-cyan-100 font-medium">Verified Blood Banks</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Building className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.verifiedBloodBanks?.toLocaleString() || 0}</h3>
            <p className="text-sm text-cyan-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Trusted</span> partners
            </p>
          </div>
        </motion.div>

        {/* Registered Hospitals */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-teal-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Stethoscope className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-teal-100 font-medium">Registered Hospitals</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.registeredHospitals?.toLocaleString() || 0}</h3>
            <p className="text-sm text-teal-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Network</span> hospitals
            </p>
          </div>
        </motion.div>

        {/* Lives Saved Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-rose-500 to-red-700 rounded-3xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Activity className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-red-100 font-medium">Lives Saved</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats.livesSaved?.toLocaleString() || 0}</h3>
            <p className="text-sm text-red-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Impact</span> generated
            </p>
          </div>
        </motion.div>

        {/* Total Revenue Card */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-3xl p-6 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <CreditCard className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-purple-100 font-medium">Total Revenue</p>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">₹{stats.totalRevenue?.toLocaleString() || 0}</h3>
            <p className="text-sm text-purple-200 flex items-center gap-1 font-medium">
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs">Updated</span> just now
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">User Growth (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowthData || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{stroke: '#f3f4f6', strokeWidth: 2}}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Donors" dataKey="donors" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="Blood Banks" dataKey="banks" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="Hospitals" dataKey="hospitals" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Blood Group Distribution</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            {stats.bloodGroupData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.bloodGroupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent = 0}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.bloodGroupData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 600 }}
                  />
                  <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 font-medium">No donor data available yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Verifications</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Name/Organization</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.pendingVerifications?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    All caught up! No pending verifications.
                  </td>
                </tr>
              ) : (
                stats.pendingVerifications?.map((org: any) => (
                  <tr key={org.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {org.type === 'HOSPITAL' ? <Stethoscope className="w-4 h-4 text-gray-400" /> : <Building2 className="w-4 h-4 text-gray-400" />}
                        {org.user?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${org.type === 'HOSPITAL' ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'}`}>
                        {org.type === 'HOSPITAL' ? 'HOSPITAL' : 'BLOOD BANK'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{org.city}, {org.state}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleVerifyClick(org)}
                        disabled={verifyingId === org.id}
                        className="text-white bg-primary-red hover:bg-red-600 px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2 ml-auto"
                      >
                        {verifyingId === org.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && orgToVerify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Verify Organization</h2>
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to verify <strong>{orgToVerify.user?.name}</strong>? They will be permanently marked as a trusted {orgToVerify.type === 'HOSPITAL' ? 'hospital' : 'blood bank'} on the platform.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowVerifyModal(false)}
                disabled={verifyingId === orgToVerify.id}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmVerification}
                disabled={verifyingId === orgToVerify.id}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {verifyingId === orgToVerify.id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Approve & Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
