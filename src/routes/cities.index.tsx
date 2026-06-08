import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { CityCard } from "@/components/CityCard";
import { Pagination } from "@/components/Pagination";
import { useCities } from "@/lib/queries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/cities/")({
  head: () => ({
    meta: [
      { title: "المدن — إعرف فلسطين" },
      { name: "description", content: "تعرّف على المدن الفلسطينية وتاريخها." },
      { property: "og:title", content: "مدن فلسطين — Palestinian Cities" },
      { property: "og:description", content: "Palestinian cities and their history." },
    ],
  }),
  component: CitiesPage,
});

export function CitiesPage() {
  const { t, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";
  const { data: cities = [], isLoading } = useCities();
  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-24 py-12">
      <h1 className={`text-3xl md:text-4xl font-bold text-text-primary ${align} mb-12`}>
        {t("page_cities")}
      </h1>

      <SectionHeader
        title={t("cities_section_title")}
        subtitle={t("cities_section_sub")}
        seeAllHref="/cities"
      />

      {isLoading ? (
        <p className="text-text-secondary text-sm">{t("loading")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[29px] gap-y-12">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}

      <Pagination total={3} active={0} />
    </div>
  );
}
