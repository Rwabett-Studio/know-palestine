import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /** Toggle between /en/* and root paths */
  const toggleLang = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);

    // Navigate to the equivalent URL in the other language
    let nextPath: string;
    if (lang === "ar") {
      // Going to English: prepend /en
      nextPath = `/en${pathname}`;
    } else {
      // Going to Arabic: strip /en prefix
      nextPath = pathname.startsWith("/en/")
        ? pathname.slice(3)
        : pathname === "/en"
          ? "/"
          : pathname;
    }
    navigate({ to: nextPath as "/" });
    setOpen(false);
  };

  const NAV_ITEMS = [
    { to: "/" as const, label: t("nav_home"), exact: true },
    { to: "/cities" as const, label: t("nav_cities") },
    { to: "/articles" as const, label: t("nav_articles") },
    { to: "/figures" as const, label: t("nav_figures") },
    { to: "/history" as const, label: t("nav_history") },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    const searchPath = lang === "en" ? "/en/search" : "/search";
    navigate({ to: searchPath as "/search", search: { q: q.trim() } });
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1440px] h-[88px] px-6 md:px-24 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-text-primary text-background flex items-center justify-center text-sm font-bold">
            {lang === "ar" ? "ف" : "P"}
          </div>
          <span className="text-lg font-bold text-text-primary leading-tight">
            {t("site_name")}
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={it.exact ? { exact: true } : undefined}
              className="h-11 px-4 rounded-[12px] flex items-center text-sm text-text-primary hover:bg-surface transition-colors"
              activeProps={{ className: "bg-surface font-semibold" }}
            >
              {it.label}
            </Link>
          ))}
        </div>

        {/* Search + actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <form onSubmit={submitSearch} className="relative">
            <Search
              className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary`}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_placeholder")}
              className={`h-11 w-44 lg:w-56 ${lang === "ar" ? "pr-9 pl-3" : "pl-9 pr-3"} rounded-[12px] bg-surface text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-text-primary/20`}
            />
          </form>
          <button
            type="button"
            onClick={toggleLang}
            className="h-11 px-3 rounded-[12px] text-xs font-medium text-text-primary hover:bg-surface transition-colors"
            aria-label="Switch language"
          >
            {t("switch_lang")}
          </button>
          <Link
            to="/about"
            className="h-11 px-5 rounded-[12px] bg-text-primary text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center"
          >
            {t("subscribe")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-text-primary"
          aria-label={t("menu")}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-6 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className="h-11 px-3 rounded-[10px] flex items-center text-text-primary hover:bg-surface"
                activeProps={{ className: "bg-surface font-semibold" }}
                activeOptions={it.exact ? { exact: true } : undefined}
              >
                {it.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleLang();
                setOpen(false);
              }}
              className="h-11 px-3 rounded-[10px] flex items-center text-text-primary hover:bg-surface text-start"
            >
              {t("switch_lang")}
            </button>
            <form onSubmit={submitSearch} className="relative mt-2">
              <Search
                className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary`}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search_placeholder")}
                className={`h-11 w-full ${lang === "ar" ? "pr-9 pl-3" : "pl-9 pr-3"} rounded-[12px] bg-surface text-sm`}
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
