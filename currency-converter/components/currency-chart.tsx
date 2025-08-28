"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CurrencyChartProps {
  fromCurrency: string
  toCurrency: string
}

// Mock 7-day data
const generateChartData = (from: string, to: string) => {
  const baseRate = 0.85
  const data = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Generate realistic fluctuation
    const variation = (Math.random() - 0.5) * 0.1
    const rate = baseRate + variation

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: Number.parseFloat(rate.toFixed(4)),
      fullDate: date.toISOString().split("T")[0],
    })
  }

  return data
}

export function CurrencyChart({ fromCurrency, toCurrency }: CurrencyChartProps) {
  const chartData = generateChartData(fromCurrency, toCurrency)

  return (
    <ChartContainer
      config={{
        rate: {
          label: `${fromCurrency}/${toCurrency}`,
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
          <YAxis className="text-muted-foreground" fontSize={12} domain={["dataMin - 0.01", "dataMax + 0.01"]} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value: number) => [value.toFixed(4), `${fromCurrency}/${toCurrency}`]}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="var(--color-rate)"
            strokeWidth={3}
            dot={{ fill: "var(--color-rate)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-rate)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
