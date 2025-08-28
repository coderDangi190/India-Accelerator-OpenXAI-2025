import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get("from");
    const toCurrency = searchParams.get("to");

    // 1. Validate input parameters
    if (!fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: "Missing 'from' or 'to' currency parameters" },
        { status: 400 }
      );
    }

    // --- Get API Keys from Environment Variables ---
    const newsApiKey = process.env.NEWS_API_KEY;
    const exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!newsApiKey || !exchangeRateApiKey) {
      throw new Error("An API key is not defined in .env.local");
    }
 // --- Fetch News and Exchange Rate Concurrently ---
    const newsQuery = encodeURIComponent(`currency exchange ${fromCurrency} ${toCurrency}`);
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${newsQuery}&sortBy=relevancy&language=en&apiKey=${newsApiKey}`;
    const rateApiUrl = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${fromCurrency}`;

    const [newsResponse, rateResponse] = await Promise.all([
      fetch(newsApiUrl),
      fetch(rateApiUrl),
    ]);    

    // --- Process Exchange Rate Response ---
    if (!rateResponse.ok) throw new Error("Failed to fetch exchange rate");
    const rateData = await rateResponse.json();
    const rate = rateData.conversion_rates?.[toCurrency];

    if (!rate) {
      throw new Error(`Could not find rate for currency: ${toCurrency}`);
    }

    // --- Process News Response (for AI summary) ---
    if (!newsResponse.ok) throw new Error("Failed to fetch news");
    const newsData = await newsResponse.json();
    // TODO: Send newsData.articles to a real AI service for summarization.
    
    const mockSummary = `The ${fromCurrency} has shown slight volatility against the ${toCurrency} this week, influenced by recent trade balance reports. The trend suggests a stable outlook, favorable for near-term travel plans.`;

    // --- Return Combined Data ---
    return NextResponse.json({ summary: mockSummary, rate: rate });

  } catch (error) {
    console.error("Error in market-summary API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate market summary.", details: errorMessage },
      { status: 500 }
    );
  }
}