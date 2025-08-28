"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const marketData = [
  { pair: "EUR/USD", rate: "1.0842", change: "+0.12%", trend: "up" },
  { pair: "GBP/USD", rate: "1.2654", change: "-0.08%", trend: "down" },
  { pair: "USD/JPY", rate: "149.32", change: "+0.24%", trend: "up" },
  { pair: "USD/CAD", rate: "1.3521", change: "+0.05%", trend: "up" },
  { pair: "AUD/USD", rate: "0.6789", change: "-0.15%", trend: "down" },
  { pair: "USD/CHF", rate: "0.8934", change: "+0.09%", trend: "up" },
]

export function MarketTicker() {
  return (
    <section className="bg-card/50 border-y py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live Market Updates</h3>
          <Badge variant="secondary" className="animate-pulse">
            Updated 30s ago
          </Badge>
        </div>

        <div className="relative">
          <div className="flex animate-scroll gap-8 whitespace-nowrap">
            {[...marketData, ...marketData].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-background rounded-lg px-4 py-2 border shadow-sm min-w-fit"
              >
                <div className="font-medium text-foreground">{item.pair}</div>
                <div className="font-semibold text-lg">{item.rate}</div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    item.trend === "up" ? "text-accent" : "text-destructive"
                  }`}
                >
                  {item.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
