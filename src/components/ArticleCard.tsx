import { Link } from "@tanstack/react-router";
import type { Article } from "@/data/content";
import { useLanguage } from "@/lib/i18n";

interface ArticleCardProps {
  article: Article;
  imageHeight?: number;
}

export function ArticleCard({ article, imageHeight = 202 }: ArticleCardProps) {
  const { t, pick, lang } = useLanguage();
  const title = pick(article, "title");
  const date = pick(article, "date");
  const align = lang === "ar" ? "text-right" : "text-left";

  return (
    <article className="flex flex-col">
      <Link
        to="/articles/$id"
        params={{ id: article.id }}
        className={`group block ${align}`}
        aria-label={title}
      >
        <img
          src={article.image}
          alt={title}
          loading="lazy"
          style={{ height: `${imageHeight}px` }}
          className="w-full object-cover rounded-[24px] bg-placeholder transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <h3 className="mt-4 text-base font-bold text-text-primary group-hover:underline">
          {title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 h-7 px-3 rounded-md bg-surface">
            {t("section_share")} <span aria-hidden>↗</span>
          </span>
          <span>{date}</span>
        </div>
      </Link>
    </article>
  );
}
