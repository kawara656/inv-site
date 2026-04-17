export type Market = "US" | "JP";

export interface WatchlistItem {
  symbol: string;
  name: string;
  market: Market;
}

export interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  market: Market;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  high: number | null;
  low: number | null;
  prevClose: number | null;
  updatedAt: string | null;
  error?: string;
}

export interface StockApiResponse {
  success: boolean;
  data?: StockQuote;
  error?: string;
}

export interface BatchStockApiResponse {
  success: boolean;
  data?: StockQuote[];
  error?: string;
}