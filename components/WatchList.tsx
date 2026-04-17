"use client";

import { useState, useTransition } from "react";
import type { StockQuote } from "@/types/stock";

interface WatchListProps {
  initialData: StockQuote[];
}

function formatPrice(price: number | null, market: string): string {
  if (price === null) return "—";
  return market === "JP"
    ? `¥${price.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}`
    : `$${price.toFixed(2)}`;
}

function formatChange(change: number | null): string {
  if (change === null) return "—";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
}

function formatChangePercent(cp: number | null): string {
  if (cp === null) return "—";
  const sign = cp >= 0 ? "+" : "";
  return `${sign}${cp.toFixed(2)}%`;
}

function StockCard({ stock }: { stock: StockQuote }) {
  const isPositive = stock.changePercent !== null && stock.changePercent >= 0;
  const isNegative = stock.changePercent !== null && stock.changePercent < 0;
  const changeColor = isPositive
    ? "text-emerald-400"
    : isNegative
    ? "text-red-400"
    : "text-gray-400";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-2 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-gray-400 truncate">{stock.symbol}</p>
          <p className="text-sm font-medium text-white truncate">{stock.name}</p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
            stock.market === "US"
              ? "bg-blue-900 text-blue-300"
              : "bg-purple-900 text-purple-300"
          }`}
        >
          {stock.market}
        </span>
      </div>

      {stock.error ? (
        <p className="text-xs text-gray-500 mt-1">{stock.error}</p>
      ) : (
        <div className="flex items-end justify-between mt-1">
          <p className="text-xl font-bold text-white">
            {formatPrice(stock.price, stock.market)}
          </p>
          <div className={`text-right text-sm font-medium ${changeColor}`}>
            <p>{formatChange(stock.change)}</p>
            <p>{formatChangePercent(stock.changePercent)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchList({ initialData }: WatchListProps) {
  const [stocks, setStocks] = useState<StockQuote[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const usStocks = stocks.filter((s) => s.market === "US");
  const jpStocks = stocks.filter((s) => s.market === "JP");

  function refresh() {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/stocks/batch", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          setStocks(json.data);
          setLastUpdated(new Date());
        } else {
          setError(json.error ?? "更新に失敗しました");
        }
      } catch {
        setError("ネットワークエラーが発生しました");
      }
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">ウォッチリスト</h1>
          <p className="text-xs text-gray-500 mt-1">
            最終更新: {lastUpdated.toLocaleTimeString("ja-JP")}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isPending ? "更新中..." : "更新"}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-900 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            US
          </span>
          <h2 className="text-lg font-semibold text-gray-200">米国株</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {usStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-900 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            JP
          </span>
          <h2 className="text-lg font-semibold text-gray-200">日本株</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {jpStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>
    </div>
  );
}
