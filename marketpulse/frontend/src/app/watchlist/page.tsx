import { Nav } from '@/components/Nav';

export default function Page() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="mt-3 text-slate-400">Edit backend/src/config/stocks.json and call POST /stocks/reload.</p>
      </main>
    </>
  );
}
