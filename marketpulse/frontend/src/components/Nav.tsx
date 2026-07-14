import Link from 'next/link';

const links = [
  ['/', 'Dashboard'],
  ['/signals', 'Signals'],
  ['/watchlist', 'Watchlist'],
  ['/settings', 'Settings']
] as const;

export function Nav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
      <Link href="/" className="text-2xl font-bold text-cyan-300">
        MarketPulse AI
      </Link>
      <div className="flex gap-3">
        {links.map(([href, label]) => (
          <Link className="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800" href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
