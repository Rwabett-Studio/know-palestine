import { createServerFn } from "@tanstack/react-start";
import process from "node:process";
import { z } from "zod";

// AI image generation for admin editors.
// Uses DALL-E 3 (OpenAI). Set OPENAI_API_KEY as a server-only env var:
//   - Locally: add to .env (no VITE_ prefix)
//   - Cloudflare: add as a Worker secret
// The key NEVER reaches the browser.

const InputSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  kind: z.enum(["article", "city", "figure", "history"]),
});

export type GenerateImageInput = z.infer<typeof InputSchema>;

function buildPrompt(input: GenerateImageInput): string {
  const base = "High-quality editorial photography, documentary style, dramatic natural lighting, subtle film grain, suitable for a Palestinian news and history archive website. No text overlays. Photorealistic.";

  switch (input.kind) {
    case "article":
      return `Documentary editorial photograph for a news article: "${input.title}". ${input.description ? `Context: ${input.description}.` : ""} Evocative and thought-provoking. ${base}`;

    case "city":
      return `Wide landscape or architectural photograph of the Palestinian city "${input.title}". ${input.description ? `${input.description}.` : ""} Shows the city's character — streets, buildings, landscape, skyline. ${base}`;

    case "figure":
      return `Dignified formal portrait photograph of a Palestinian historical figure, "${input.title}". ${input.description ? `${input.description}.` : ""} Respectful, serious tone. Black and white or warm-toned colour. ${base}`;

    case "history":
      return `Historical documentary photograph representing the Palestinian event: "${input.title}". ${input.description ? `${input.description}.` : ""} Conveys historical weight and significance. ${base}`;
  }
}

export const generateImage = createServerFn({ method: "POST" })
  .inputValidator(InputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "مفتاح OpenAI غير مُعدّ. أضف OPENAI_API_KEY إلى متغيّرات البيئة (أو أسرار Cloudflare Worker) لتفعيل توليد الصور.",
      );
    }

    const prompt = buildPrompt(data);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        style: "natural",
        response_format: "url",
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const parsed = JSON.parse(detail || "{}") as { error?: { message?: string } };
      throw new Error(
        `تعذّر توليد الصورة (${res.status}): ${parsed?.error?.message ?? detail.slice(0, 200)}`,
      );
    }

    const payload = (await res.json()) as {
      data?: { url?: string; revised_prompt?: string }[];
    };
    const url = payload.data?.[0]?.url;
    if (!url) throw new Error("لم تُرجع الخدمة رابط صورة صالح.");

    return {
      url,
      revisedPrompt: payload.data?.[0]?.revised_prompt ?? "",
    };
  });
