import { useLanguage } from "@/lib/i18n";

interface PaginationProps {
  total?: number;
  active?: number;
}

export function Pagination({ total = 3, active = 0 }: PaginationProps) {
  const { t, lang } = useLanguage();
  return (
    <div className="flex items-center justify-center gap-3 py-10" dir={lang === "ar" ? "rtl" : "ltr"}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`${t("section_pagination_page")} ${i + 1}`}
          className={`w-[38px] h-[46px] rounded-[7.5px] flex items-center justify-center text-sm transition-colors ${
            i === active
              ? "bg-accent-warm text-text-primary"
              : "bg-background border border-border text-text-primary hover:bg-surface"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
