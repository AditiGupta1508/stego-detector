import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function HistogramChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1A222D" vertical={false} />
        <XAxis dataKey="bucket" tick={{ fill: '#8CA0B3', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#263241' }} />
        <YAxis tick={{ fill: '#8CA0B3', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#263241' }} />
        <Tooltip
          contentStyle={{ background: '#121821', border: '1px solid #263241', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8CA0B3' }}
        />
        <Bar dataKey="R" fill="#FF6B4A" radius={[2, 2, 0, 0]} />
        <Bar dataKey="G" fill="#00E5A0" radius={[2, 2, 0, 0]} />
        <Bar dataKey="B" fill="#4FD1FF" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
