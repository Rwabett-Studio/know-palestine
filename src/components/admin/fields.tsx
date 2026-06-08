import { useState } from "react";
import type { ReactNode } from "react";
import { generateImage } from "@/lib/api/generateImage.functions";
import type { GenerateImageInput } from "@/lib/api/generateImage.functions";

const inputCls =
  "w-full h-11 px-3 rounded-[10px] bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-text-primary/20";
const areaCls =
  "w-full px-3 py-2 rounded-[10px] bg-background border border-border text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-text-primary/20";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-primary mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-text-secondary mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className={inputCls}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={areaCls} />
    </Field>
  );
}

// Edits a string[] as one item per line.
export function LinesArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
}) {
  return (
    <Field label={label} hint="سطر لكل عنصر — One item per line">
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        rows={rows}
        className={areaCls}
      />
    </Field>
  );
}

export type Block = { heading?: string; paragraph: string };

// Edits an ordered list of {heading?, paragraph} blocks.
export function BlockEditor({
  label,
  value,
  onChange,
  tt,
}: {
  label: string;
  value: Block[];
  onChange: (v: Block[]) => void;
  tt: (ar: string, en: string) => string;
}) {
  const update = (i: number, patch: Partial<Block>) =>
    onChange(value.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...value, { heading: "", paragraph: "" }]);

  return (
    <div>
      <span className="block text-sm font-medium text-text-primary mb-2">{label}</span>
      <div className="space-y-3">
        {value.map((b, i) => (
          <div key={i} className="rounded-[12px] border border-border p-3 space-y-2 bg-surface/40">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-text-secondary">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} className="h-7 w-7 rounded-[8px] bg-surface hover:bg-accent-warm text-sm" aria-label="up">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="h-7 w-7 rounded-[8px] bg-surface hover:bg-accent-warm text-sm" aria-label="down">↓</button>
                <button type="button" onClick={() => remove(i)} className="h-7 px-2 rounded-[8px] text-sm text-red-600 hover:bg-red-50">{tt("حذف", "Delete")}</button>
              </div>
            </div>
            <input
              type="text"
              value={b.heading ?? ""}
              onChange={(e) => update(i, { heading: e.target.value })}
              placeholder={tt("عنوان فرعي (اختياري)", "Subheading (optional)")}
              className={inputCls}
            />
            <textarea
              value={b.paragraph}
              onChange={(e) => update(i, { paragraph: e.target.value })}
              placeholder={tt("الفقرة", "Paragraph")}
              rows={4}
              className={areaCls}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 h-9 px-3 rounded-[10px] text-sm bg-surface hover:bg-accent-warm"
      >
        {tt("+ إضافة فقرة", "+ Add block")}
      </button>
    </div>
  );
}

export function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// Image URL field with optional AI generation (DALL-E 3) and live preview.
// Pass `genContext` to show the ✦ Generate button.
export function ImageField({
  label,
  value,
  onChange,
  genContext,
  tt,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  genContext?: GenerateImageInput;
  tt: (ar: string, en: string) => string;
}) {
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const generate = async () => {
    if (!genContext?.title?.trim()) {
      setGenError(tt("أدخل العنوان أولاً لتوليد الصورة.", "Enter a title first."));
      return;
    }
    setGenerating(true);
    setGenError(null);
    try {
      const result = await generateImage({ data: genContext });
      onChange(result.url);
    } catch (e) {
      setGenError(String((e as Error).message ?? e));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-text-primary">{label}</span>
      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 h-11 px-3 rounded-[10px] bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        />
        {genContext && (
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            title={tt("توليد صورة بالذكاء الاصطناعي", "Generate AI image")}
            className="shrink-0 h-11 px-4 rounded-[10px] bg-text-primary text-background text-xs font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
          >
            {generating ? (
              <span className="inline-block animate-spin">⟳</span>
            ) : (
              <span>✦</span>
            )}
            {tt(
              generating ? "جارٍ التوليد…" : "توليد صورة",
              generating ? "Generating…" : "Generate",
            )}
          </button>
        )}
      </div>

      {genError && (
        <p className="text-xs text-red-500 bg-red-50 rounded-[8px] px-3 py-2">{genError}</p>
      )}

      {value && (
        <img
          src={value}
          alt={tt("معاينة الصورة", "Image preview")}
          className="w-full max-h-[260px] object-cover rounded-[12px] bg-surface"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          onLoad={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "block";
          }}
        />
      )}

      {genContext && (
        <p className="text-[11px] text-text-secondary leading-5">
          {tt(
            "الصورة المُولَّدة صالحة لمدة ساعة. انسخ الرابط إلى التخزين الدائم (Supabase Storage / Cloudinary) قبل انتهاء الصلاحية.",
            "Generated URLs expire after 1 hour. Copy to permanent storage (Supabase Storage / Cloudinary) before saving.",
          )}
        </p>
      )}
    </div>
  );
}

// Two fields side by side: Arabic + English.
export function BiField({ ar, en }: { ar: ReactNode; en: ReactNode }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {ar}
      {en}
    </div>
  );
}

export function FormShell({
  title,
  onSubmit,
  onDelete,
  saving,
  backTo,
  children,
  dir,
  tt,
}: {
  title: string;
  onSubmit: () => void;
  onDelete?: () => void;
  saving: boolean;
  backTo: ReactNode;
  children: ReactNode;
  dir: "rtl" | "ltr";
  tt: (ar: string, en: string) => string;
}) {
  return (
    <form
      dir={dir}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-3xl"
    >
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          {backTo}
          <h1 className="text-2xl font-bold text-text-primary mt-1">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="h-10 px-4 rounded-[10px] text-sm text-red-600 border border-red-200 hover:bg-red-50"
            >
              {tt("حذف", "Delete")}
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? tt("جارٍ الحفظ...", "Saving...") : tt("حفظ", "Save")}
          </button>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </form>
  );
}
