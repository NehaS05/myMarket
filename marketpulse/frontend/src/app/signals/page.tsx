import { Nav } from '@/components/Nav';

export default function Page() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Signals</h1>
        <p className="mt-3 text-slate-400">Live BUY/SELL signal history is available from the dashboard stream.</p>
      </main>
    </>
  );
}
