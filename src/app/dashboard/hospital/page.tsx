"use client";

import { Activity, Users, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HospitalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
        <Link href="/emergency" className="bg-primary-red hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Blood Request
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Requests</p>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
              </div>
              <div className="w-10 h-10 bg-red-50 text-primary-red rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completed Requests</p>
                <h3 className="text-2xl font-bold text-gray-900">458</h3>
              </div>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Blood Requests</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Patient Name</th>
                <th className="px-6 py-3 font-semibold">Blood Group</th>
                <th className="px-6 py-3 font-semibold">Units</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Rahul Verma</td>
                <td className="px-6 py-4 font-bold text-primary-red">B+</td>
                <td className="px-6 py-4">2 Units</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">Pending</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-red hover:underline font-medium">View Donors</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Priya Singh</td>
                <td className="px-6 py-4 font-bold text-primary-red">O-</td>
                <td className="px-6 py-4">1 Unit</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Accepted</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-red hover:underline font-medium">Contact Donor</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
