import { CategoryScreen } from "@/components/learn-screens";
import { categories } from "@/lib/courses-data";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryScreen categoryId={category} />;
}
