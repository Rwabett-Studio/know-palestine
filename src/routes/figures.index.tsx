import { createFileRoute } from "@tanstack/react-router";
import { FigureCard } from "@/components/FigureCard";
import {
  FIELD_LABEL,
  FIELD_LABEL_EN,
  type FigureField,
} from "@/data/content";
import { useState } from "react";
import { useFigures } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/figures/")({
  head: () => ({
    meta: [
      { title: "شخصيات وأعلام — إعرف فلسطين" },
      { name: "description", content: "توثيق الشخصيات الفلسطينية البارزة." },
      { property: "og:title", content: "شخصيات وأعلام — Palestinian Figures" },
      { property: "og:description", content: "Notable Palestinian figures across history." },
    ],
  }),
  component: FiguresPage,
});

export function FiguresPage() {
  const { t, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";
  const justify = lang === "ar" ? "justify-end" : "justify-start";
  const [filter, setFilter] = useState<FigureField | "all">("all");
  const { data: figures = [] } = useFigures();
  const fields = Array.from(new Set(figures.map((f) => f.field)));
  const list = filter === "all" ? figures : figures.filter((f) => f.field === filter);
  const labels = lang === "en" ? FIELD_LABEL_EN : FIELD_LABEL;

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12">
      <header className={`${align} mb-10`}>
        <h1 className="text-4xl font-bold text-text-primary">{t("page_figures")}</h1>
        <p className="mt-3 text-text-secondary max-w-2xl">{t("page_figures_sub")}</p>
      </header>

      <div className={`flex flex-wrap gap-2 ${justify} mb-10`}>
        <button
          onClick={() => setFilter("all")}
          className={`h-9 px-4 rounded-[10px] text-sm transition-colors ${
            filter === "all" ? "bg-text-primary text-background" : "bg-surface text-text-primary"
          }`}
        >
          {t("filter_all")}
        </button>
        {fields.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 px-4 rounded-[10px] text-sm transition-colors ${
              filter === f ? "bg-text-primary text-background" : "bg-surface text-text-primary"
            }`}
          >
            {labels[f]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[29px] gap-y-12">
        {list.map((figure) => (
          <FigureCard key={figure.id} figure={figure} />
        ))}
      </div>
    </div>
  );
}
