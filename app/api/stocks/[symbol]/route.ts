import { resolveStockQuote } from "@/lib/fiinnhub";
import { ALL_WATCHLIST } from "@/lib/watchlist";
import type { StockApiResponse } from "@/types/stock";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
): Promise<Response> {
  const { symbol } = await params;
  const decoded = decodeURIComponent(symbol).toUpperCase();

  const item = ALL_WATCHLIST.find(
    (w) => w.symbol.toUpperCase() === decoded
  );

  if (!item) {
    const response: StockApiResponse = {
      success: false,
      error: `シンボル "${decoded}" はウォッチリストに存在しません`,
    };
    return Response.json(response, { status: 404 });
  }

  try {
    const data = await resolveStockQuote(item);
    const response: StockApiResponse = { success: true, data };
    return Response.json(response);
  } catch (err) {
    const response: StockApiResponse = {
      success: false,
      error: err instanceof Error ? err.message : "不明なエラー",
    };
    return Response.json(response, { status: 500 });
  }
}
