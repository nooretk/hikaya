import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Compass, Heart, Home, Info, MapPin, PenLine, Waypoints } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/map", label: "Map", icon: MapPin, end: false },
  { to: "/constellation", label: "Connections", icon: Waypoints, end: false },
  { to: "/contribute", label: "Contribute", icon: PenLine, end: false },
  { to: "/explorer", label: "Explorer", icon: Compass, end: false },
  { to: "/about", label: "About", icon: Info, end: false },
];

/**
 * Shell shared by every page: the decorative bar, header, primary navigation
 * and footer. Pages render into the <Outlet />.
 */
export const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col">
    <div className="h-2 w-full bg-gradient-to-r from-brand-olive via-brand-amber to-brand-olive" />

    <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/" className="space-y-1 group">
          <span className="font-serif font-black text-4xl tracking-tight text-brand-olive flex items-center gap-2">
            HIKAYA
            <span
              className="text-brand-amber font-serif italic font-semibold text-2xl"
              dir="rtl"
            >
              حكاية
            </span>
          </span>
          <p className="text-xs text-brand-muted max-w-xl font-serif italic leading-relaxed">
            AI-powered platform for preserving Palestinian memory and heritage.
          </p>
        </Link>

        <span className="bg-brand-amber/10 text-brand-amber text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-brand-amber/20 uppercase tracking-wider self-start">
          Sprint 2 MVP
        </span>
      </div>

      <nav className="flex flex-wrap items-center gap-1 mt-8 border-b border-brand-border-light">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `pb-3 pt-1 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "border-brand-olive text-brand-olive"
                  : "border-transparent text-brand-muted hover:text-brand-olive"
              }`
            }
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>

    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <Outlet />
    </main>

    <footer className="mt-8 py-8 text-center text-[10px] text-brand-muted font-mono tracking-widest uppercase space-y-1 border-t border-brand-border-light">
      <p>© 2026 Hikaya · Preserving Palestinian identity</p>
      <div className="flex justify-center items-center gap-1.5 text-brand-amber">
        <Heart className="w-3 h-3 fill-current" /> Team Beta
      </div>
    </footer>
  </div>
);
