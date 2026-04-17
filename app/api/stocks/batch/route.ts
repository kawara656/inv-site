import { resolveStockQuotes } from "@/lib/fiinnhub";
import { ALL_WATCHLIST } from "@/lib/watchlist";
import type { BatchStockApiResponse } from "@/types/stock";

export const revalidate = 60;

export async function GET(): Promise<Response> {
  try {
    const data = await resolveStockQuotes(ALL_WATCHLIST);
    const response: BatchStockApiResponse = { success: true, data };
    return Response.json(response);
  } catch (err) {
    const response: BatchStockApiResponse = {
      success: false,
      error: err instanceof Error ? err.message : "不明なエラー",
    };
    return Response.json(response, { status: 500 });
  }
}
