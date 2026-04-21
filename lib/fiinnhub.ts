import type { FinnhubQuote, StockQuote, WatchlistItem } from "@/types/stock";
import { fetchJpStockQuote } from "@/lib/yahoo";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error("FINNHUB_API_KEY が設定されていません。");
  }
  return key;
}

export async function fetchUsStockQuote(symbol: string): Promise<FinnhubQuote> {
  const apiKey = getApiKey();
  const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Finnhub API エラー: ${res.status} (symbol: ${symbol})`);
  }

  const data = await res.json();

  if (data.c === 0 && data.pc === 0) {
    throw new Error(`シンボル "${symbol}" のデータが見つかりません`);
  }

  return data as FinnhubQuote;
}

export async function resolveStockQuote(item: WatchlistItem): Promise<StockQuote> {
  if (item.market === "JP") {
    try {
      return await fetchJpStockQuote(item);
    } catch (err) {
      return {
        symbol: item.symbol,
        name: item.name,
        market: "JP",
        price: null,
        change: null,
        changePercent: null,
        high: null,
        low: null,
        prevClose: null,
        updatedAt: null,
        error: err instanceof Error ? err.message : "不明なエラー",
      };
    }
  }

  try {
    const quote = await fetchUsStockQuote(item.symbol);
    return {
      symbol: item.symbol,
      name: item.name,
      market: "US",
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      prevClose: quote.pc,
      updatedAt: new Date(quote.t * 1000).toISOString(),
    };
  } catch (err) {
    return {
      symbol: item.symbol,
      name: item.name,
      market: "US",
      price: null,
      change: null,
      changePercent: null,
      high: null,
      low: null,
      prevClose: null,
      updatedAt: null,
      error: err instanceof Error ? err.message : "不明なエラー",
    };
  }
}

export async function resolveStockQuotes(items: WatchlistItem[]): Promise<StockQuote[]> {
  return Promise.all(items.map(resolveStockQuote));
}