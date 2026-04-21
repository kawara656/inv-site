import type { StockQuote, WatchlistItem } from "@/types/stock";

// .T suffix → stooq symbol (e.g. 7203.T → 7203.jp)
function toStooqSymbol(symbol: string): string {
  return symbol.replace(/\.T$/i, ".jp").toLowerCase();
}

export async function fetchJpStockQuote(item: WatchlistItem): Promise<StockQuote> {
  const stooqSymbol = toStooqSymbol(item.symbol);
  const url = `https://stooq.com/q/l/?s=${stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`stooq APIエラー: ${res.status} (${item.symbol})`);
  }

  const text = await res.text();
  const lines = text.trim().split("\n");

  // lines[0] = header, lines[1] = data
  if (lines.length < 2) {
    throw new Error(`"${item.symbol}" のデータが見つかりません`);
  }

  const cols = lines[1].split(",");
  // Symbol,Date,Time,Open,High,Low,Close,Volume
  const [, date, time, open, high, low, close] = cols;

  const price = parseFloat(close);
  const openVal = parseFloat(open);

  if (isNaN(price)) {
    throw new Error(`"${item.symbol}" のデータが不正です`);
  }

  const change = price - openVal;
  const changePercent = openVal !== 0 ? (change / openVal) * 100 : 0;
  const updatedAt = date && time ? new Date(`${date}T${time}+09:00`).toISOString() : null;

  return {
    symbol: item.symbol,
    name: item.name,
    market: "JP",
    price,
    change,
    changePercent,
    high: parseFloat(high),
    low: parseFloat(low),
    prevClose: openVal,
    updatedAt,
  };
}
