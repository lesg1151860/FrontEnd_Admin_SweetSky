"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    ingresos: 4000,
    egresos: 2400,
  },
  {
    name: "Feb",
    ingresos: 3000,
    egresos: 1398,
  },
  {
    name: "Mar",
    ingresos: 2000,
    egresos: 800,
  },
  {
    name: "Abr",
    ingresos: 2780,
    egresos: 1908,
  },
  {
    name: "May",
    ingresos: 1890,
    egresos: 800,
  },
  {
    name: "Jun",
    ingresos: 2390,
    egresos: 1200,
  },
  {
    name: "Jul",
    ingresos: 3490,
    egresos: 2100,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, ""]} labelFormatter={(label) => `Mes: ${label}`} />
        <Bar dataKey="ingresos" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="egresos" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

