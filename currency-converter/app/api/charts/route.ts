import { NextRequest, NextResponse } from 'next/server';

// Helper to calculate start date based on timeframe
const getStartDate = (timeframe: string): Date => {
  const now = new Date();
  switch (timeframe) {
    case '1D':
      now.setDate(now.getDate() - 1);
      break;
    case '7D':
      now.setDate(now.getDate() - 7);
      break;
    case '1M':
      now.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      now.setMonth(now.getMonth() - 3);
      break;
    case '1Y':
      now.setFullYear(now.getFullYear() - 1);
      break;
    default:
      now.setDate(now.getDate() - 7); // Default to 7 days
  }
  return now;
};

// Mock function for technical indicators as this is complex
const getMockIndicators = () => {
    return [
        { name: "RSI", value: (Math.random() * (70 - 30) + 30).toFixed(1), status: "neutral", description: "Relative Strength Index" },
        { name: "MACD", value: (Math.random() * 0.005).toFixed(4), status: "bullish", description: "Moving Average Convergence Divergence" },
        { name: "SMA 20", value: (Math.random() * (0.9 - 0.8) + 0.8).toFixed(4), status: "bearish", description: "Simple Moving Average (20 periods)" },
    ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pair = searchParams.get('pair'); // e.g., "USD/EUR"
  const timeframe = searchParams.get('timeframe'); // e.g., "7D"

  if (!pair || !timeframe) {
    return NextResponse.json({ error: 'Missing "pair" or "timeframe" parameters' }, { status: 400 });
  }

  const [fromCurrency, toCurrency] = pair.split('/');
  if (!fromCurrency || !toCurrency) {
    return NextResponse.json({ error: 'Invalid "pair" format. Expected "FROM/TO"' }, { status: 400 });
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    console.error("API key is not defined in .env.local");
    return NextResponse.json({ error: "Server configuration error: API key missing." }, { status: 500 });
  }

  const endDate = new Date();
  const startDate = getStartDate(timeframe);
  
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/timeseries/${fromCurrency}/${toCurrency}/${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}/${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorBody = await response.json();
      if (errorBody['error-type'] === 'plan-upgrade-required') {
          throw new Error("Your API plan does not support time-series data, which is required for charts.");
      }
      throw new Error(errorBody['error-type'] || 'Failed to fetch historical data');
    }

    const data = await response.json();
    if (data.result === 'error') {
        throw new Error(`External API error: ${data['error-type']}`);
    }

    const rates = data.rates;
    const chartData = Object.entries(rates).map(([date, rateObj]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: (rateObj as any)[toCurrency],
    }));

    const firstRate = chartData[0]?.value;
    const lastRate = chartData[chartData.length - 1]?.value;
    const change = firstRate && lastRate ? ((lastRate - firstRate) / firstRate) * 100 : 0;
    const volume = `${(Math.random() * 3 + 0.5).toFixed(1)}B`; // Mock volume
    const indicators = getMockIndicators();

    return NextResponse.json({ chartData, change, volume, indicators });

  } catch (error) {
    console.error("Error in chart-data API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch chart data.", details: errorMessage },
      { status: 500 }
    );
  }
}