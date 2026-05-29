import Link from "next/link";

export default function PageShell({ children, active }) {
  const navItems = [
    { href: "/", label: "首页" },
    { href: "/consult", label: "咨询" },
    { href: "/history", label: "历史" }
  ];

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <nav className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/86 px-3 py-2 shadow-sm">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            家长沟通教练
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  active === item.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        {children}
      </div>
    </main>
  );
}
