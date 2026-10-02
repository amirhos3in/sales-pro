import { ModuleScreen } from "@/components/course-views";
import { moduleStaticParams } from "@/lib/curriculum";

export function generateStaticParams() {
  return moduleStaticParams();
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ track: string; module: string }>;
}) {
  const resolved = await params;
  return (
    <ModuleScreen trackSlug={resolved.track} moduleSlug={resolved.module} />
  );
}
