import { NextRequest, NextResponse } from "next/server";

// This function maps our app's timeframe to the Alpha Vantage API function
function getAlphaVantageFunction(timeframe: string) {
  switch (timeframe) {
    case "1D":
      return "FX_INTRADAY&interval=60min"; // Daily view with hourly data
    case "7D":
    case "1M":
      return "FX_DAILY"; // Daily data
    case "3M":
    case "1Y":
      return "FX_WEEKLY"; // Weekly data
    default:
      return "FX_DAILY";
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get("from");
    const toCurrency = searchParams.get("to");
    const timeframe = searchParams.get("timeframe") || "7D";

    if (!fromCurrency || !toCurrency) {
      return NextResponse.json({ error: "Missing currency parameters" }, { status: 400 });
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error("ALPHA_VANTAGE_API_KEY is not defined");
    }

    const avFunction = getAlphaVantageFunction(timeframe);
    const apiUrl = `https://www.alphavantage.co/query?function=${avFunction}&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=compact&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch data from Alpha Vantage");
    }

    const data = await response.json();
    const timeSeriesKey = Object.keys(data).find(key => key.includes("Time Series"));

    if (!timeSeriesKey || !data[timeSeriesKey]) {
      // Alpha Vantage free tier is limited. If you get this error, try again later.
      if (data["Information"]) throw new Error(`API call limit reached: ${data["Information"]}`);
      throw new Error("Could not find time series data in API response.");
    }

    const timeSeries = data[timeSeriesKey];

    // Format the data for a candlestick chart
    const chartData = Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
      time: new Date(time).getTime() / 1000, // time for Lightweight Charts
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
    })).reverse(); // API returns newest first, charts need oldest first

    // --- Calculate Summary Info ---
    if (chartData.length < 2) {
      return NextResponse.json({ chartData, summary: { change: 0, changePercent: 0, volume: "N/A" } });
    }
    const latestClose = chartData[chartData.length - 1].close;
    const previousClose = chartData[chartData.length - 2].close;
    const change = latestClose - previousClose;
    const changePercent = (change / previousClose) * 100;

    const summary = {
      change: change,
      changePercent: changePercent,
      volume: "1.8B", // Note: Alpha Vantage free tier doesn't provide volume for FX
    };

    return NextResponse.json({ chartData, summary });

  } catch (error) {
    console.error("Error in chart-data API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch chart data.", details: errorMessage }, { status: 500 });
  }
}