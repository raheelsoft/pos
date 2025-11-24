"use client"

import { useEffect, useState } from "react"
import { salesService } from "@/lib/services/sales-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

type Sale = {
  id: string
  total: number
  created_at: string
}

export default function AnalyticsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [timeRange, setTimeRange] = useState("7d")
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  })
  const [chartData, setChartData] = useState<{ date: string; total: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    // In a real app, we would pass timeRange to the service to filter on the backend
    const { data: salesData } = await salesService.getSales(timeRange)

    if (salesData) {
      // Filter locally for the mock service since it returns everything
      const now = new Date()
      const startDate = new Date()
      if (timeRange === "7d") startDate.setDate(now.getDate() - 7)
      else if (timeRange === "30d") startDate.setDate(now.getDate() - 30)
      else if (timeRange === "90d") startDate.setDate(now.getDate() - 90)

      const filteredSales = salesData.filter((sale: any) => new Date(sale.created_at) >= startDate)

      setSales(filteredSales)

      // Calculate Metrics
      const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + sale.total, 0)
      const totalOrders = filteredSales.length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      setMetrics({
        totalRevenue,
        totalOrders,
        avgOrderValue,
      })

      // Prepare Chart Data
      const groupedData = filteredSales.reduce(
        (acc: Record<string, number>, sale: any) => {
          const date = new Date(sale.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          acc[date] = (acc[date] || 0) + sale.total
          return acc
        },
        {} as Record<string, number>,
      )

      const chart = Object.entries(groupedData).map(([date, total]) => ({
        date,
        total: Number(total),
      }))
      setChartData(chart)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Transactions processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Daily revenue breakdown for the selected period</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available for this period
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
