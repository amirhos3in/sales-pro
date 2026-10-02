import { ArticleScreen } from "@/components/articles-screen";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleScreen slug={slug} />;
}
