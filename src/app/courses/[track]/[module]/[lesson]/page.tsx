import { LessonScreen } from "@/components/course-views";
import { lessonStaticParams } from "@/lib/curriculum";

export function generateStaticParams() {
  return lessonStaticParams();
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; module: string; lesson: string }>;
}) {
  const resolved = await params;
  return (
    <LessonScreen
      trackSlug={resolved.track}
      moduleSlug={resolved.module}
      lessonSlug={resolved.lesson}
    />
  );
}
