import { useLanguage } from "@/lib/i18n";

export function FooterBar() {
  const { t } = useLanguage();
  return (
    <div className="w-full bg-footer-bar text-background/80">
      <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <span>
          © {new Date().getFullYear()} {t("site_name")} — {t("footer_rights")}
        </span>
        <div className="flex items-center gap-4">
          {[
            { href: "https://x.com/KnowPalestine", label: t("footer_twitter") },
            { href: "https://facebook.com/KnowPalestine", label: t("footer_facebook") },
            { href: "https://instagram.com/KnowPalestine", label: t("footer_instagram") },
            { href: "https://youtube.com/@KnowPalestine", label: t("footer_youtube") },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-background transition-opacity hover:opacity-80"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
