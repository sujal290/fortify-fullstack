// PATH: client/src/components/RevenueChart.jsx  (NEW FILE)
'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function RevenueChart({ data = [] }) {
  if (data.length === 0) {
    return <div className="bg-white border border-[#eee] p-8 text-center text-muted text-sm">No revenue in the last 30 days yet.</div>;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }));

  return (
    <div className="bg-white border border-[#eee] p-6">
      <h3 className="font-display text-lg mb-4">Revenue — last 30 days</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B7844A" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#B7844A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={{ stroke: '#eee' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            formatter={(value) => [fmt(value), 'Revenue']}
            contentStyle={{ borderRadius: 0, border: '1px solid #eee', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#B7844A" strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}