import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { useSettings, settingValue } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — إعرف فلسطين" },
      { name: "description", content: "منصة رقمية متخصصة في توثيق فلسطين بأسلوب صحفي رصين." },
      { property: "og:title", content: "About — Know Palestine" },
      { property: "og:description", content: "Learn about our mission and team." },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const { t, lang } = useLanguage();
  const align = lang === "ar" ? "text-right" : "text-left";
  const { data: settings } = useSettings();

  const tagline = settingValue(settings, "about_tagline", lang, t("site_tagline"));
  const intro = settingValue(settings, "about_intro", lang, t("about_intro_html"));
  const missionTitle = settingValue(settings, "about_mission_title", lang, t("about_mission"));
  const missionBody = settingValue(settings, "about_mission_body", lang, t("about_mission_body"));

  const PILLARS = [
    { title: t("about_pillar_1_t"), body: t("about_pillar_1_b") },
    { title: t("about_pillar_2_t"), body: t("about_pillar_2_b") },
    { title: t("about_pillar_3_t"), body: t("about_pillar_3_b") },
  ];

  return (
    <div className="mx-auto max-w-[1248px] px-6 md:px-24 py-16">
      <header className={`${align} mb-12`}>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">{t("page_about")}</h1>
        {tagline && (
          <p className="mt-3 text-base font-medium text-text-primary">{tagline}</p>
        )}
        <p className="mt-6 text-lg text-text-secondary leading-9 max-w-3xl">
          {intro}
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {PILLARS.map((p) => (
          <div key={p.title} className={`p-6 rounded-[24px] bg-surface/60 ${align}`}>
            <h3 className="text-lg font-bold text-text-primary mb-2">{p.title}</h3>
            <p className="text-sm text-text-secondary leading-7">{p.body}</p>
          </div>
        ))}
      </section>

      <section className={align}>
        <h2 className="text-3xl font-bold text-text-primary mb-4">{missionTitle}</h2>
        <p className="text-base text-text-secondary leading-9 max-w-3xl">
          {missionBody}
        </p>
      </section>
    </div>
  );
}
