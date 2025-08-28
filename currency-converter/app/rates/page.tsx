"use client"

import { useState , useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Search, Star, Bell, RefreshCw, DollarSign } from "lucide-react"

interface Rate {
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
  name: string;
}

interface Insight {
  title: string;
  description: string;
  time: string;
  impact: string;
}
export default function RatesPage() {
  const [exchangeRates, setExchangeRates] = useState<Rate[]>([]);
  const [marketInsights, setMarketInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>(["EUR", "GBP"])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/all-rates');
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setExchangeRates(data.exchangeRates);
      setMarketInsights(data.marketInsights);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error(error);
      // Optionally set an error state to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on initial component mount

  const filteredRates = exchangeRates.filter(
    (rate) =>
      rate.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (currency: string) => {
    setFavorites((prev) => (prev.includes(currency) ? prev.filter((c) => c !== currency) : [...prev, currency]))
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Exchange Rates</h1>
              <p className="text-muted-foreground">Live currency exchange rates updated every minute</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Last updated: {lastUpdated}
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exchange Rates Table */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Rates</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      USD Exchange Rates
                    </CardTitle>
                    <CardDescription>Base currency: US Dollar (USD)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredRates.map((rate) => (
                        <div
                          key={rate.to}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{rate.flag}</span>
                            <div>
                              <div className="font-semibold text-foreground">USD/{rate.to}</div>
                              <div className="text-sm text-muted-foreground">{rate.name}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-foreground">{rate.rate.toFixed(4)}</div>
                              <div
                                className={`text-sm flex items-center gap-1 ${
                                  rate.change >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {rate.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {rate.changePercent >= 0 ? "+" : ""}
                                {rate.changePercent.toFixed(2)}%
                              </div>
                            </div>

                            <Button variant="ghost" size="sm" onClick={() => toggleFavorite(rate.to)} className="p-2">
                              <Star
                                className={`h-4 w-4 ${
                                  favorites.includes(rate.to)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      Favorite Currencies
                    </CardTitle>
                    <CardDescription>Your most watched currency pairs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredRates
                        .filter((rate) => favorites.includes(rate.to))
                        .map((rate) => (
                          <div
                            key={rate.to}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rate.flag}</span>
                              <div>
                                <div className="font-semibold text-foreground">USD/{rate.to}</div>
                                <div className="text-sm text-muted-foreground">{rate.name}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">{rate.rate.toFixed(4)}</div>
                                <div
                                  className={`text-sm flex items-center gap-1 ${
                                    rate.change >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {rate.change >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {rate.changePercent >= 0 ? "+" : ""}
                                  {rate.changePercent.toFixed(2)}%
                                </div>
                              </div>

                              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(rate.to)} className="p-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="trending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Trending Currencies
                    </CardTitle>
                    <CardDescription>Most volatile currency pairs today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredRates
                        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                        .slice(0, 5)
                        .map((rate) => (
                          <div
                            key={rate.to}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rate.flag}</span>
                              <div>
                                <div className="font-semibold text-foreground">USD/{rate.to}</div>
                                <div className="text-sm text-muted-foreground">{rate.name}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">{rate.rate.toFixed(4)}</div>
                                <div
                                  className={`text-sm flex items-center gap-1 ${
                                    rate.change >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {rate.change >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {rate.changePercent >= 0 ? "+" : ""}
                                  {rate.changePercent.toFixed(2)}%
                                </div>
                              </div>

                              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(rate.to)} className="p-2">
                                <Star
                                  className={`h-4 w-4 ${
                                    favorites.includes(rate.to)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Market Insights Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  Market Insights
                </CardTitle>
                <CardDescription>Latest currency market updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">{insight.title}</h4>
                      <Badge
                        variant={
                          insight.impact === "high"
                            ? "destructive"
                            : insight.impact === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs ml-2"
                      >
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <span className="text-xs text-muted-foreground">{insight.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rate Alerts</CardTitle>
                <CardDescription>Get notified when rates hit your target</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Rate Alert
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Premium Features</CardTitle>
                <CardDescription>Unlock advanced rate tracking tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Real-time rate alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Historical rate analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>API access</span>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
