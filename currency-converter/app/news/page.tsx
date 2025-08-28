"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Newspaper,
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Globe,
  BarChart3,
  Calendar,
  Filter,
  ExternalLink,
  Loader2,
} from "lucide-react"


// Define the Article type
interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  impact: string;
  timestamp: string;
  source: string;
  currencies: string[];
  image: string;
  url: string;
}


const economicEvents = [
  {
    time: "09:30 EST",
    event: "US GDP Quarterly Report",
    currency: "USD",
    impact: "high",
    forecast: "2.1%",
    previous: "1.9%",
  },
  {
    time: "14:00 EST",
    event: "ECB Interest Rate Decision",
    currency: "EUR",
    impact: "high",
    forecast: "4.50%",
    previous: "4.50%",
  },
  {
    time: "20:30 EST",
    event: "BoJ Policy Meeting Minutes",
    currency: "JPY",
    impact: "medium",
    forecast: "-",
    previous: "-",
  },
  {
    time: "Tomorrow",
    event: "UK Employment Data",
    currency: "GBP",
    impact: "medium",
    forecast: "4.2%",
    previous: "4.3%",
  },
]

const categories = [
  "All News",
  "Breaking News",
  "Central Banks",
  "Economic Data",
  "Market Analysis",
  "Emerging Markets",
  "Commodities",
]

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All News")
  const [selectedImpact, setSelectedImpact] = useState("all")

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: searchTerm,
          category: selectedCategory,
        });
        const response = await fetch(`/api/news?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchNews();
    }, 500); // Debounce to avoid fetching on every keystroke

    return () => clearTimeout(debounceFetch);
  }, [searchTerm, selectedCategory]);

  
  const filteredArticles = articles.filter((article) => {
    // Impact filter is now client-side as the API doesn't support it
    const matchesImpact = selectedImpact === "all" || article.impact === selectedImpact
    return matchesImpact
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <TrendingUp className="h-3 w-3" />
      case "medium":
        return <BarChart3 className="h-3 w-3" />
      case "low":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Market News</h1>
              <p className="text-muted-foreground">Latest currency market updates and economic news</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                All Sources
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedImpact} onValueChange={setSelectedImpact}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Feed */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="latest" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="breaking">Breaking</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="data">Economic Data</TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-6">

                {loading && (
                  <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-4 text-muted-foreground">Loading latest news...</span>
                  </div>
                )}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!loading && !error && filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                              <Badge className={`text-xs ${getImpactColor(article.impact)}`}>
                                {getImpactIcon(article.impact)}
                                <span className="ml-1 capitalize">{article.impact}</span>
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.timestamp}
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer" onClick={() => window.open(article.url, '_blank')}>
                            {article.title}
                          </h3>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.summary}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Affects:</span>
                              <div className="flex gap-1">
                                {article.currencies.map((currency) => (
                                  <Badge key={currency} variant="secondary" className="text-xs">
                                    {currency}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{article.source}</span>
                              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => window.open(article.url, '_blank')}>
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="breaking" className="space-y-6">
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      Breaking News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredArticles
                        .filter((a) => a.impact === "high")
                        .slice(0, 3)
                        .map((article) => (
                          <div key={article.id} className="p-4 bg-white rounded-lg border">
                            <h4 className="font-semibold text-foreground mb-2">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{article.timestamp}</span>
                              <div className="flex gap-1">
                                {article.currencies.map((currency) => (
                                  <Badge key={currency} variant="secondary" className="text-xs">
                                    {currency}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                {filteredArticles
                  .filter((a) => a.category === "Market Analysis")
                  .map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.timestamp}
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                              {article.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-3">{article.summary}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Affects:</span>
                                <div className="flex gap-1">
                                  {article.currencies.map((currency) => (
                                    <Badge key={currency} variant="secondary" className="text-xs">
                                      {currency}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{article.source}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                {filteredArticles
                  .filter((a) => a.category === "Economic Data")
                  .map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {article.category}
                              </Badge>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.timestamp}
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                              {article.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-3">{article.summary}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Affects:</span>
                                <div className="flex gap-1">
                                  {article.currencies.map((currency) => (
                                    <Badge key={currency} variant="secondary" className="text-xs">
                                      {currency}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{article.source}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Economic Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Economic Calendar
                </CardTitle>
                <CardDescription>Upcoming market-moving events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {economicEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                      <Badge variant={event.impact === "high" ? "destructive" : "secondary"} className="text-xs">
                        {event.impact}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{event.event}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-xs">
                        {event.currency}
                      </Badge>
                      <div className="text-muted-foreground">
                        {event.forecast !== "-" && <span>Forecast: {event.forecast}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Market Sentiment
                </CardTitle>
                <CardDescription>Current market mood indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">USD Strength</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-green-600">Bullish</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EUR Outlook</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-yellow-600">Neutral</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Appetite</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-6 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-red-600">Risk Off</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Daily Market Brief</CardTitle>
                <CardDescription>Get the latest currency news delivered to your inbox</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Enter your email" type="email" />
                <Button className="w-full" size="sm">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Subscribe Free
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Daily market analysis and breaking news alerts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
