import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  trend?: "up" | "down"
  trendPercent?: number
}

export function StatCard({ icon, title, value, trend, trendPercent }: StatCardProps) {
  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && trendPercent && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trendPercent}% this month</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
