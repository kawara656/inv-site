import type { StockQuote, WatchlistItem } from "@/types/stock";

interface YahooMeta {
  regularMarketPrice: number;
  chartPreviousClose: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketTime: number;
}

interface YahooChartResponse {
  chart: {
    result: Array<{ meta: YahooMeta }> | null;
    error: { code: string; description: string } | null;
  };
}

export async function fetchJpStockQuote(item: WatchlistItem): Promise<StockQuote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d&range=1d`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance APIエラー: ${res.status} (${item.symbol})`);
  }

  const data: YahooChartResponse = await res.json();

  if (data.chart.error || !data.chart.result?.[0]) {
    throw new Error(
      data.chart.error?.description ?? `"${item.symbol}" のデータが見つかりません`
    );
  }

  const meta = data.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose;
  const change = price - prevClose;
  const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

  return {
    symbol: item.symbol,
    name: item.name,
    market: "JP",
    price,
    change,
    changePercent,
    high: meta.regularMarketDayHigh,
    low: meta.regularMarketDayLow,
    prevClose,
    updatedAt: new Date(meta.regularMarketTime * 1000).toISOString(),
  };
}
