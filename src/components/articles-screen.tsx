import Link from "next/link";
import { articles, findArticle } from "@/lib/articles";
import { faNumber } from "@/lib/format";

export function ArticlesScreen() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">مقالات</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          یادداشت‌های کوتاه برای قلاب تماس، بستن، اعتراض قیمت و اثبات در دایرکت.
        </p>
      </header>
      <div className="grid gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10 transition hover:ring-primary/40"
          >
            <p className="text-xs text-muted-foreground">
              {article.tag} · {faNumber(article.minutes)} دقیقه
            </p>
            <h2 className="mt-2 text-lg font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArticleScreen({ slug }: { slug: string }) {
  const article = findArticle(slug);
  if (!article) {
    return (
      <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
        <h1 className="text-xl font-semibold">مقاله پیدا نشد</h1>
        <Link href="/articles" className="mt-3 inline-block text-sm text-primary">
          بازگشت به مقالات
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/articles" className="text-sm text-muted-foreground">
        مقالات
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">
        {article.tag} · {faNumber(article.minutes)} دقیقه مطالعه
      </p>
      <h1 className="mt-2 text-3xl font-semibold leading-snug">{article.title}</h1>
      <div className="mt-6 space-y-4">
        {article.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-8">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
