import type { Signal } from '@/types/market';

export function SignalCard({ signal }: { signal: Signal }) {
  const isBuy = signal.signal === 'BUY';

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${isBuy ? 'text-emerald-300' : 'text-rose-300'}`}>
            {signal.signal}
          </p>
          <h3 className="text-2xl font-bold">{signal.symbol}</h3>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-200">{signal.confidence}%</div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <span>Entry ₹{signal.entry}</span>
        <span>Target ₹{signal.target}</span>
        <span>SL ₹{signal.stopLoss}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.reason.map((reason) => (
          <span key={reason} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
            {reason}
          </span>
        ))}
      </div>

      <time className="mt-4 block text-xs text-slate-500">{new Date(signal.createdAt).toLocaleString()}</time>
    </article>
  );
}
