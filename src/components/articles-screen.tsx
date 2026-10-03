"use client";

import Link from "next/link";
import { articles, findArticle, type ArticleBlock, type Localized } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

function tx(value: Localized, lang: "fa" | "en") {
  return value[lang];
}

export function ArticlesScreen() {
  const { copy, lang } = useI18n();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#0B132B] dark:text-[#F6F1E4]">{copy.articlesPage.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{copy.articlesPage.intro}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.id} className="glass flex flex-col overflow-hidden rounded-3xl shadow-[0_10px_30px_-10px_rgba(15,28,63,0.08)]">
            <img
              src={article.coverImage}
              alt=""
              className="h-44 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-[#D4AF37]/40 px-2 py-1 text-[#B89020]">
                  {tx(article.category, lang)}
                </span>
                <span>{tx(article.publishedAt, lang)}</span>
                <span>· {tx(article.readTime, lang)}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-8 text-[#0B132B] dark:text-[#F6F1E4]">
                {tx(article.title, lang)}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{tx(article.excerpt, lang)}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {tx(article.author.name, lang)} · {tx(article.author.role, lang)}
              </p>
              <Link
                href={`/articles/${article.slug}`}
                className="mt-4 inline-flex h-10 items-center self-start rounded-2xl bg-[#0F1C3F] px-4 text-sm text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0B132B]"
              >
                {copy.articlesPage.more}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ArticleScreen({ slug }: { slug: string }) {
  const { copy, lang } = useI18n();
  const article = findArticle(slug);
  if (!article) {
    return (
      <div className="glass rounded-3xl p-6">
        <h1 className="text-xl font-semibold">{copy.articlesPage.missing}</h1>
        <Link href="/articles" className="mt-3 inline-block text-sm text-[#B89020]">
          {copy.articlesPage.back}
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link href="/articles" className="text-sm text-[#B89020]">
        {copy.articlesPage.back}
      </Link>
      <img
        src={article.coverImage}
        alt=""
        className="h-56 w-full rounded-3xl object-cover shadow-[0_10px_30px_-10px_rgba(15,28,63,0.12)] sm:h-72"
      />
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-[#D4AF37]/40 px-2 py-1 text-[#B89020]">
          {tx(article.category, lang)}
        </span>
        <span>{tx(article.publishedAt, lang)}</span>
        <span>· {tx(article.readTime, lang)}</span>
      </div>
      <h1 className="text-3xl font-semibold leading-snug text-[#0B132B] dark:text-[#F6F1E4]">
        {tx(article.title, lang)}
      </h1>
      <div className="glass rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">{copy.articlesPage.by}</p>
        <p className="mt-1 font-medium">{tx(article.author.name, lang)}</p>
        <p className="text-sm text-muted-foreground">{tx(article.author.role, lang)}</p>
      </div>
      <div className="glass space-y-4 rounded-3xl p-5 sm:p-6">
        {article.content.map((block) => (
          <Block key={blockKey(block, lang)} block={block} lang={lang} />
        ))}
      </div>
    </article>
  );
}

function Block({ block, lang }: { block: ArticleBlock; lang: "fa" | "en" }) {
  if (block.type === "h2") {
    return <h2 className="pt-2 text-lg font-semibold text-[#0F1C3F] dark:text-[#E5C07B]">{tx(block.text, lang)}</h2>;
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-2 ps-5 text-sm leading-7">
        {block.items.map((item) => (
          <li key={tx(item, lang)} className="list-disc">
            {tx(item, lang)}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm leading-8 text-[#0F1C3F] dark:text-[#F6F1E4]">{tx(block.text, lang)}</p>;
}

function blockKey(block: ArticleBlock, lang: "fa" | "en") {
  if (block.type === "ul") return block.items.map((item) => tx(item, lang)).join("|");
  return tx(block.text, lang);
}
