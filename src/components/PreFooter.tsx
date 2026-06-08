import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export function PreFooter() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({ email: trimmed });
      if (error) {
        // "23505" = unique_violation (already subscribed)
        if (error.code === "23505") {
          setStatus("success"); // treat as success
        } else {
          console.error("[newsletter]", error.message);
          setStatus("error");
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
    }
  };
  const SECTIONS = [
    { to: "/cities" as const, label: t("nav_cities") },
    { to: "/articles" as const, label: t("nav_articles") },
    { to: "/figures" as const, label: t("nav_figures") },
    { to: "/history" as const, label: t("nav_history") },
    { to: "/about" as const, label: t("nav_about") },
  ];

  return (
    <section className="w-full" style={{ backgroundColor: "rgba(233, 233, 233, 0.5)" }}>
      <div className="mx-auto max-w-[1440px] py-16 px-6 md:px-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-text-primary text-background flex items-center justify-center font-bold">
                {lang === "ar" ? "ف" : "P"}
              </div>
              <h3 className="text-xl font-bold text-text-primary leading-tight">
                {t("site_name")}
              </h3>
            </div>
            <p className="text-text-secondary text-sm leading-7 max-w-sm">
              {t("site_tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-primary mb-4">{t("footer_sections")}</h4>
            <ul className="space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="text-sm text-text-secondary hover:text-text-primary">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-primary mb-4">{t("footer_newsletter")}</h4>
            <p className="text-sm text-text-secondary mb-4">{t("footer_newsletter_desc")}</p>
            {status === "success" ? (
              <p className="text-sm text-green-700 bg-green-50 rounded-[12px] px-4 py-3">
                {tt("شكراً! تم تسجيل بريدك بنجاح.", "Thank you! You've been subscribed.")}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder={t("footer_email_placeholder")}
                  required
                  aria-label={t("footer_email_placeholder")}
                  className={`flex-1 h-11 px-3 rounded-[12px] bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-text-primary/20 ${status === "error" ? "border-red-400" : "border-border"}`}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 px-5 rounded-[12px] bg-text-primary text-background text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {status === "loading"
                    ? tt("...", "...")
                    : t("subscribe")}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-red-600">
                {tt("يرجى إدخال بريد إلكتروني صحيح.", "Please enter a valid email address.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
