import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatFcfaCourt } from '../../utils/format'

const PALETTE = ['#12459c', '#1f6feb', '#4e93fb', '#86b9ff', '#0f766e', '#b45309', '#7c3aed', '#be123c']

const axis = { tick: { fontSize: 11, fill: '#66728c' }, stroke: '#d5d9e2' }

export function BarreChart({
  data,
  xKey,
  series,
  money = false,
  height = 260,
}: {
  data: Record<string, unknown>[]
  xKey: string
  series: { key: string; label: string }[]
  money?: boolean
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey={xKey} {...axis} interval={0} angle={-18} textAnchor="end" height={54} />
        <YAxis {...axis} tickFormatter={(v: number) => (money ? formatFcfaCourt(v) : String(v))} width={money ? 84 : 44} />
        <Tooltip formatter={(v) => (money ? formatFcfaCourt(Number(v)) : String(v))} contentStyle={{ fontSize: 12 }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function LigneChart({
  data,
  xKey,
  series,
  money = false,
  height = 260,
}: {
  data: Record<string, unknown>[]
  xKey: string
  series: { key: string; label: string }[]
  money?: boolean
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => (money ? formatFcfaCourt(v) : String(v))} width={money ? 84 : 44} />
        <Tooltip formatter={(v) => (money ? formatFcfaCourt(Number(v)) : String(v))} contentStyle={{ fontSize: 12 }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AireChart({
  data,
  xKey,
  series,
  money = false,
  height = 260,
}: {
  data: Record<string, unknown>[]
  xKey: string
  series: { key: string; label: string }[]
  money?: boolean
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => (money ? formatFcfaCourt(v) : String(v))} width={money ? 84 : 44} />
        <Tooltip formatter={(v) => (money ? formatFcfaCourt(Number(v)) : String(v))} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={PALETTE[i % PALETTE.length]}
            fill={PALETTE[i % PALETTE.length]}
            fillOpacity={0.14}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RepartitionChart({
  data,
  nameKey,
  valueKey,
  height = 260,
}: {
  data: Record<string, unknown>[]
  nameKey: string
  valueKey: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius={52} outerRadius={86} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
