"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '12 AM', donations: 10 },
  { time: '4 AM', donations: 13 },
  { time: '8 AM', donations: 6 },
  { time: '12 PM', donations: 11 },
  { time: '4 PM', donations: 19 },
  { time: '8 PM', donations: 23 },
  { time: '12 AM', donations: 32 },
];

export default function BloodBankChart() {
  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C62121" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#C62121" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ color: '#C62121', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="donations" 
            stroke="#C62121" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDonations)" 
            activeDot={{ r: 6, fill: '#C62121', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
