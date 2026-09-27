import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
  { href: "/assets", label: "Assets" },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface md:block">
      <div className="px-6 py-6">
        <p className="text-sm font-semibold tracking-tight text-ink">
          Asset &amp; Onboarding
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted">Tracker</p>
      </div>
      <nav className="px-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
