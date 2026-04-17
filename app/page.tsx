import { resolveStockQuotes } from "@/lib/fiinnhub";
import { ALL_WATCHLIST } from "@/lib/watchlist";
import WatchList from "@/components/WatchList";

export const revalidate = 60;

export default async function Home() {
  const stocks = await resolveStockQuotes(ALL_WATCHLIST);

  return (
    <main className="min-h-screen bg-gray-900 py-6">
      <WatchList initialData={stocks} />
    </main>
  );
}
