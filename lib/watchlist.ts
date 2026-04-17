import type { WatchlistItem } from "@/types/stock";

export const US_WATCHLIST: WatchlistItem[] = [
  { symbol: "AAPL", name: "Apple", market: "US" },
  { symbol: "MSFT", name: "Microsoft", market: "US" },
  { symbol: "GOOGL", name: "Alphabet", market: "US" },
  { symbol: "AMZN", name: "Amazon", market: "US" },
  { symbol: "NVDA", name: "NVIDIA", market: "US" },
  { symbol: "META", name: "Meta Platforms", market: "US" },
  { symbol: "BRK.B", name: "Berkshire Hathaway B", market: "US" },
  { symbol: "JPM", name: "JPMorgan Chase", market: "US" },
];

export const JP_WATCHLIST: WatchlistItem[] = [
  { symbol: "7203.T", name: "トヨタ自動車", market: "JP" },
  { symbol: "6758.T", name: "ソニーグループ", market: "JP" },
  { symbol: "9432.T", name: "NTT", market: "JP" },
  { symbol: "8306.T", name: "三菱UFJ", market: "JP" },
  { symbol: "6861.T", name: "キーエンス", market: "JP" },
  { symbol: "9984.T", name: "ソフトバンクグループ", market: "JP" },
  { symbol: "9101.T", name: "九州電力", market: "JP" },
  { symbol: "4063.T", name: "信越化学工業", market: "JP" },
];

export const ALL_WATCHLIST: WatchlistItem[] = [
  ...US_WATCHLIST,
  ...JP_WATCHLIST,
];