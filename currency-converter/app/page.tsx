"use client"

import { useState , useEffect} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, MapPin, TrendingUp, Download, Smartphone } from "lucide-react"
import { CurrencyChart } from "@/components/currency-chart"
import { MarketTicker } from "@/components/market-ticker"

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "NPR", name: "Nepali Rupee", flag: "🇳🇵" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [rate, setRate] = useState(0)
  const [marketSummary, setMarketSummary] = useState("Loading AI-powered market summary...")

  useEffect(() => {
    const fetchData = async () => {
      if (!fromCurrency || !toCurrency) return;

      setMarketSummary(`Generating summary for ${fromCurrency} to ${toCurrency}...`);
      try {
        const response = await fetch(`/api/market-summary?from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // data is now { summary: "...", rate: 0.85 }

        // Set state with data from our API
        setMarketSummary(data.summary);
        setRate(data.rate);

        // Perform calculation with the new rate
        const numericAmount = Number.parseFloat(amount);
        if (!Number.isNaN(numericAmount)) {
          const result = (numericAmount * data.rate).toFixed(2);
          setConvertedAmount(result);
        } else {
          setConvertedAmount("");
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setMarketSummary(`Could not load market data for ${fromCurrency}/${toCurrency}.`);
      }
    };

    fetchData();
  }, [amount, fromCurrency, toCurrency]);


  const swapCurrencies = () => {
    const currentFrom = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(currentFrom)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <Badge variant="secondary" className="text-sm">
                Trusted by 2M+ Travelers
              </Badge>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Currency Exchange
              <span className="text-primary block">Made Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get real-time exchange rates, market insights, and travel-friendly currency conversion tools.
            </p>
          </div>

          {/* Currency Converter Widget */}
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Currency Converter</CardTitle>
              <CardDescription>Live rates updated every minute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* From Amount */}
                <div className="md:col-span-2 space-y-2">
                  {/* <label className="text-sm font-medium text-muted-foreground">Amount</label> */}
                  <label htmlFor="amount" className="text-sm font-medium text-muted-foreground">Amount</label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl h-14 text-center font-semibold"
                    placeholder="Enter amount"
                  />
                </div>

                {/* From Currency */}
                <div className="space-y-2">
                   <label htmlFor="from-currency" className="text-sm font-medium text-muted-foreground">From</label>
                  {/* <label className="text-sm font-medium text-muted-foreground">From</label> */}
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger id="from-currency" className="h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground text-sm">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapCurrencies}
                    className="h-14 w-14 rounded-full bg-transparent"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-2">
                  <label htmlFor="to-currency" className="text-sm font-medium text-muted-foreground">To</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger id="to-currency" className="h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground text-sm">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Result */}
              <div className="text-center py-6 bg-card rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">Converted Amount</div>
                <div className="text-4xl font-bold text-primary">
                  {convertedAmount || "0.00"} {toCurrency}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  1 {fromCurrency} = {rate} {toCurrency}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Chart and CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 7-Day Trend Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    7-Day Trend: {fromCurrency} to {toCurrency}
                  </CardTitle>
                  <CardDescription>Historical exchange rate performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <CurrencyChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-dashed border-primary/20">
                    <h4 className="font-semibold text-foreground mb-2">AI Market Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      {marketSummary}
                    </p>
                  </div>                  
                </CardContent>
              </Card>
            </div>

            {/* App Download CTA */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Download Our App</CardTitle>
                  <CardDescription>Get offline rates, travel alerts, and expense tracking on the go.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Offline currency rates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Travel expense tracker</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Rate change alerts</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Free
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Save Offline Rates</CardTitle>
                  <CardDescription>Download current rates for offline use during your travels.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Save Current Rates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
