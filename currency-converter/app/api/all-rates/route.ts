import { NextRequest, NextResponse } from "next/server";

// We need a predefined list of currencies we care about, with their metadata.
const currencyMetadata: { [key: string]: { name: string; flag: string } } = {
  EUR: { name: "Euro", flag: "🇪🇺" },
  GBP: { name: "British Pound", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", flag: "🇯🇵" },
  CAD: { name: "Canadian Dollar", flag: "🇨🇦" },
  AUD: { name: "Australian Dollar", flag: "🇦🇺" },
  CHF: { name: "Swiss Franc", flag: "🇨🇭" },
  CNY: { name: "Chinese Yuan", flag: "🇨🇳" },
  INR: { name: "Indian Rupee", flag: "🇮🇳" },
  NPR: { name: "Nepali Rupee", flag: "🇳🇵" },
  USD: { name: "US Dollar", flag: "🇺🇸" },
  SGD: { name: "Singapore Dollar", flag: "🇸🇬" },
  HKD: { name: "Hong Kong Dollar", flag: "🇭🇰" },
  NZD: { name: "New Zealand Dollar", flag: "🇳🇿" },
  SEK: { name: "Swedish Krona", flag: "🇸🇪" },
  NOK: { name: "Norwegian Krone", flag: "🇳🇴" },
  DKK: { name: "Danish Krone", flag: "🇩🇰" },
  ZAR: { name: "South African Rand", flag: "🇿🇦" },
  BRL: { name: "Brazilian Real", flag: "🇧🇷" },
  RUB: { name: "Russian Ruble", flag: "🇷🇺" },
  MXN: { name: "Mexican Peso", flag: "🇲🇽" },
};

export async function GET(request: NextRequest) {
  try {
    const exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!exchangeRateApiKey || !newsApiKey) {
      throw new Error("An API key is not defined in .env.local");
    }

    // --- Fetch Exchange Rates and News Concurrently ---
    const rateApiUrl = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`;
    const newsApiUrl = `https://newsapi.org/v2/everything?q=forex%20OR%20currency%20market&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`;

    const [rateResponse, newsResponse] = await Promise.all([
      fetch(rateApiUrl),
      fetch(newsApiUrl),
    ]);

    // --- Process Exchange Rate Data ---
    if (!rateResponse.ok) throw new Error("Failed to fetch exchange rates");
    const rateData = await rateResponse.json();
    const rates = rateData.conversion_rates;

    const formattedRates = Object.keys(currencyMetadata)
      .map(code => {
        if (rates[code] && currencyMetadata[code]) {
          return {
            from: "USD",
            to: code,
            rate: rates[code],
            // NOTE: The free ExchangeRate-API does not provide change/historical data.
            // We are mocking it here for demonstration purposes.
            change: (Math.random() - 0.5) * 0.01 * rates[code],
            changePercent: (Math.random() - 0.5) * 1,
            flag: currencyMetadata[code].flag,
            name: currencyMetadata[code].name,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove nulls for any currencies not found in the API response

    // --- Process News Data ---
    if (!newsResponse.ok) throw new Error("Failed to fetch news");
    const newsData = await newsResponse.json();
    const formattedNews = newsData.articles.slice(0, 4).map((article: any) => ({
      title: article.title,
      description: article.description,
      time: new Date(article.publishedAt).toLocaleDateString(),
      impact: "medium", // Mock impact level
    }));

    return NextResponse.json({
      exchangeRates: formattedRates,
      marketInsights: formattedNews,
    });

  } catch (error) {
    console.error("Error in all-rates API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch market data.", details: errorMessage },
      { status: 500 }
    );
  }
}