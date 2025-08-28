"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Activity, PieChart, LineChart, Maximize2 } from "lucide-react"
import { CurrencyChart } from "@/components/currency-chart"

const currencyPairs = [
  { pair: "USD/EUR", name: "US Dollar / Euro", change: -0.27, volume: "2.1B" },
  { pair: "USD/GBP", name: "US Dollar / British Pound", change: 0.57, volume: "1.8B" },
  { pair: "USD/JPY", name: "US Dollar / Japanese Yen", change: -0.82, volume: "3.2B" },
  { pair: "USD/CAD", name: "US Dollar / Canadian Dollar", change: 0.66, volume: "1.2B" },
  { pair: "EUR/GBP", name: "Euro / British Pound", change: 0.84, volume: "1.5B" },
  { pair: "GBP/JPY", name: "British Pound / Japanese Yen", change: -1.25, volume: "0.9B" },
]

const timeframes = [
  { value: "1D", label: "1 Day" },
  { value: "7D", label: "7 Days" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
]

const technicalIndicators = [
  { name: "RSI", value: "64.2", status: "neutral", description: "Relative Strength Index" },
  { name: "MACD", value: "0.0023", status: "bullish", description: "Moving Average Convergence Divergence" },
  { name: "SMA 20", value: "0.8542", status: "bearish", description: "Simple Moving Average (20 periods)" },
  { name: "Bollinger", value: "Mid", status: "neutral", description: "Bollinger Bands Position" },
]

const marketOverview = [
  { region: "North America", performance: 2.3, currencies: ["USD", "CAD"] },
  { region: "Europe", performance: -0.8, currencies: ["EUR", "GBP", "CHF"] },
  { region: "Asia Pacific", performance: -1.2, currencies: ["JPY", "AUD", "CNY"] },
  { region: "Emerging Markets", performance: 1.7, currencies: ["INR", "BRL", "MXN"] },
]

export default function ChartsPage() {
  const [selectedPair, setSelectedPair] = useState("USD/EUR")
  const [selectedTimeframe, setSelectedTimeframe] = useState("7D")
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["RSI", "MACD"])

  const currentPair = currencyPairs.find((p) => p.pair === selectedPair) || currencyPairs[0]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Currency Charts</h1>
              <p className="text-muted-foreground">Advanced technical analysis and market insights</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Real-time data
              </Badge>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Currency Pair:</label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyPairs.map((pair) => (
                    <SelectItem key={pair.pair} value={pair.pair}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{pair.pair}</span>
                        <span className={`text-xs ml-2 ${pair.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {pair.change >= 0 ? "+" : ""}
                          {pair.change.toFixed(2)}%
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Timeframe:</label>
              <div className="flex gap-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={selectedTimeframe === tf.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf.value)}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      {selectedPair} - {selectedTimeframe}
                    </CardTitle>
                    <CardDescription>{currentPair.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">24h Volume</div>
                      <div className="font-semibold">{currentPair.volume}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">24h Change</div>
                      <div
                        className={`font-semibold flex items-center gap-1 ${
                          currentPair.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {currentPair.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {currentPair.change >= 0 ? "+" : ""}
                        {currentPair.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <CurrencyChart fromCurrency={selectedPair.split("/")[0]} toCurrency={selectedPair.split("/")[1]} />
                </div>
              </CardContent>
            </Card>

            {/* Additional Charts */}
            <div className="mt-8">
              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
                  <TabsTrigger value="correlation">Correlation</TabsTrigger>
                </TabsList>

                <TabsContent value="comparison" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-accent" />
                        Multi-Currency Comparison
                      </CardTitle>
                      <CardDescription>Compare performance across major currency pairs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currencyPairs.slice(0, 6).map((pair) => (
                          <div key={pair.pair} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">{pair.pair}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  pair.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {pair.change >= 0 ? "+" : ""}
                                {pair.change.toFixed(2)}%
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">{pair.name}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Volume: {pair.volume}</span>
                              {pair.change >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="volume" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-accent" />
                        Volume Analysis
                      </CardTitle>
                      <CardDescription>Trading volume patterns and market activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Volume chart visualization would be displayed here</p>
                          <p className="text-sm">Real-time trading volume data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="correlation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-accent" />
                        Currency Correlation Matrix
                      </CardTitle>
                      <CardDescription>How different currency pairs move in relation to each other</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Correlation matrix would be displayed here</p>
                          <p className="text-sm">Statistical correlation between currency pairs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technical Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Technical Indicators
                </CardTitle>
                <CardDescription>Key technical analysis metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {technicalIndicators.map((indicator) => (
                  <div key={indicator.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-semibold text-sm">{indicator.name}</div>
                      <div className="text-xs text-muted-foreground">{indicator.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{indicator.value}</div>
                      <Badge
                        variant={
                          indicator.status === "bullish"
                            ? "default"
                            : indicator.status === "bearish"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {indicator.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Market Overview
                </CardTitle>
                <CardDescription>Regional currency performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketOverview.map((region) => (
                  <div key={region.region} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{region.region}</span>
                      <span
                        className={`text-sm font-semibold ${
                          region.performance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {region.performance >= 0 ? "+" : ""}
                        {region.performance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {region.currencies.map((currency) => (
                        <Badge key={currency} variant="outline" className="text-xs">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart Tools</CardTitle>
                <CardDescription>Customize your analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Add Trend Lines
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Technical Indicators
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare Pairs
                </Button>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Analytics</CardTitle>
                <CardDescription>Unlock professional trading tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Custom indicators</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Advanced charting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Market alerts</span>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
