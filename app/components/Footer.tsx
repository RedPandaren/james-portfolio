import Link from "next/link";
import { navLinks } from "@/app/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-sm text-text-muted">
          &copy; 2026 James Florence Conales
        </p>
        <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
