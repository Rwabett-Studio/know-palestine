import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { repo } from "@/lib/repo";
import { useLanguage } from "@/lib/i18n";
import type { SiteSettingsMap } from "@/data/content";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

// ── Editable settings groups ─────────────────────────────────────────────────

const GROUPS: {
  label: { ar: string; en: string };
  keys: { key: string; label: { ar: string; en: string }; multiline?: boolean }[];
}[] = [
  {
    label: { ar: "الصفحة الرئيسية — Hero", en: "Homepage — Hero" },
    keys: [
      { key: "home_hero_title",       label: { ar: "العنوان الرئيسي",   en: "Main title" } },
      { key: "home_hero_description", label: { ar: "الوصف",            en: "Description" }, multiline: true },
    ],
  },
  {
    label: { ar: "صفحة المقالات — مقدمة", en: "Articles Page — Intro" },
    keys: [
      { key: "intro_block_title",     label: { ar: "عنوان المقدمة",   en: "Intro title" } },
      { key: "intro_block_paragraph", label: { ar: "نص المقدمة",      en: "Intro text" }, multiline: true },
      { key: "intro_block_image",     label: { ar: "رابط الصورة",     en: "Image URL" } },
    ],
  },
  {
    label: { ar: "صفحة من نحن", en: "About Page" },
    keys: [
      { key: "about_tagline",      label: { ar: "Tagline",        en: "Tagline" } },
      { key: "about_intro",        label: { ar: "المقدمة",        en: "Intro" }, multiline: true },
      { key: "about_mission_title",label: { ar: "عنوان الرسالة", en: "Mission title" } },
      { key: "about_mission_body", label: { ar: "نص الرسالة",    en: "Mission body" }, multiline: true },
    ],
  },
  {
    label: { ar: "الفوتر والتواصل الاجتماعي", en: "Footer & Social Media" },
    keys: [
      { key: "footer_tagline",   label: { ar: "نص الفوتر",    en: "Footer tagline" } },
      { key: "social_twitter",   label: { ar: "Twitter URL",  en: "Twitter URL" } },
      { key: "social_facebook",  label: { ar: "Facebook URL", en: "Facebook URL" } },
      { key: "social_instagram", label: { ar: "Instagram URL",en: "Instagram URL" } },
      { key: "social_youtube",   label: { ar: "YouTube URL",  en: "YouTube URL" } },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

function SettingsPage() {
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery<SiteSettingsMap>({
    queryKey: ["settings"],
    queryFn: () => repo.settings.getAll(),
    staleTime: 0, // always fresh in admin
  });

  // Local edits buffer
  const [edits, setEdits] = useState<SiteSettingsMap>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function value(key: string, field: "ar" | "en"): string {
    if (edits[key] !== undefined) return edits[key][field] ?? "";
    return settings?.[key]?.[field] ?? "";
  }

  function onChange(key: string, field: "ar" | "en", v: string) {
    setEdits((prev) => ({
      ...prev,
      [key]: {
        ar: prev[key]?.ar ?? settings?.[key]?.ar ?? "",
        en: prev[key]?.en ?? settings?.[key]?.en ?? "",
        [field]: v,
      },
    }));
    setSaved(false);
  }

  async function save() {
    if (Object.keys(edits).length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await repo.settings.upsertMany(
        Object.entries(edits).map(([key, { ar, en }]) => ({
          key,
          valueAr: ar,
          valueEn: en,
        })),
      );
      setSaved(true);
      setEdits({});
      await qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (e) {
      setError((e as Error).message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  const isDirty = Object.keys(edits).length > 0;

  return (
    <div dir={dir} className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {tt("إعدادات الموقع", "Site Settings")}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {tt(
              "قم بتعديل المحتوى الثابت الظاهر في الموقع.",
              "Edit static content shown across the site.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || !isDirty}
          className="h-10 px-6 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? tt("جارٍ الحفظ...", "Saving...") : tt("حفظ التغييرات", "Save changes")}
        </button>
      </div>

      {/* Migration notice */}
      <div className="mb-6 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>{tt("قبل الاستخدام: ", "Before using: ")}</strong>
        {tt(
          "شغّل ملف الهجرة في Supabase SQL Editor: supabase/migrations/20260606_m1_status_settings.sql",
          "Run the migration in Supabase SQL Editor: supabase/migrations/20260606_m1_status_settings.sql",
        )}
      </div>

      {/* Status messages */}
      {saved && (
        <p className="mb-4 px-4 py-3 rounded-[10px] bg-green-50 text-green-700 text-sm">
          {tt("✓ تم حفظ الإعدادات بنجاح.", "✓ Settings saved successfully.")}
        </p>
      )}
      {error && (
        <p className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 text-red-700 text-sm">{error}</p>
      )}

      {isLoading ? (
        <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>
      ) : (
        <div className="space-y-8">
          {GROUPS.map((group) => (
            <section
              key={group.label.en}
              className="rounded-[16px] border border-border overflow-hidden"
            >
              <div className="px-5 py-3 bg-surface/60 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">
                  {lang === "ar" ? group.label.ar : group.label.en}
                </h2>
              </div>
              <div className="divide-y divide-border">
                {group.keys.map((field) => (
                  <div key={field.key} className="p-4 grid md:grid-cols-2 gap-3">
                    <SettingField
                      label={`${lang === "ar" ? field.label.ar : field.label.en} — عربي`}
                      value={value(field.key, "ar")}
                      onChange={(v) => onChange(field.key, "ar", v)}
                      multiline={field.multiline}
                      dir="rtl"
                    />
                    <SettingField
                      label={`${lang === "ar" ? field.label.ar : field.label.en} — English`}
                      value={value(field.key, "en")}
                      onChange={(v) => onChange(field.key, "en", v)}
                      multiline={field.multiline}
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingField({
  label,
  value,
  onChange,
  multiline,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  dir: "rtl" | "ltr";
}) {
  const base =
    "w-full text-sm rounded-[8px] border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-text-primary/20";
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-secondary mb-1 block">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
          className={`${base} py-2 resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
          className={`${base} h-10`}
        />
      )}
    </label>
  );
}
