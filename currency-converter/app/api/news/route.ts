import { NextRequest, NextResponse } from "next/server";

// A helper function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q") || "currency exchange";
  const category = searchParams.get("category");

  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey) {
    console.error("News API key is not defined in .env.local");
    return NextResponse.json(
      { error: "Server configuration error: API key missing." },
      { status: 500 }
    );
  }

  // Construct the query for the NewsAPI
  let query = searchTerm;
  if (category && category !== "All News" && category !== "Breaking News") {
    query = `${category} AND ${searchTerm}`;
  }

  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`;

  try {
    const newsResponse = await fetch(newsApiUrl);
    if (!newsResponse.ok) {
      const errorBody = await newsResponse.json();
      console.error("News API error:", errorBody);
      throw new Error(errorBody.message || "Failed to fetch news from external source");
    }

    const newsData = await newsResponse.json();

    // Format the articles to match the structure your component expects
    const formattedArticles = newsData.articles.slice(0, 20).map((article: any, index: number) => ({
      id: index + 1,
      title: article.title,
      summary: article.description || "No summary available.",
      category: article.source.name, // Using source name as category
      impact: "medium", // Mocking impact as NewsAPI doesn't provide it
      timestamp: formatDate(article.publishedAt),
      source: article.source.name,
      currencies: ["USD", "EUR", "GBP"], // Mocking affected currencies
      image: article.urlToImage || "/placeholder.svg",
      url: article.url,
    }));

    return NextResponse.json(formattedArticles);

  } catch (error) {
    console.error("Error in /api/news route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch news.", details: errorMessage },
      { status: 500 }
    );
  }
}