import { LessonPlayer } from "@/components/lesson-player";
import { learnStaticParams } from "@/lib/courses-data";

export function generateStaticParams() {
  return learnStaticParams();
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ category: string; lesson: string }>;
}) {
  const { category, lesson } = await params;
  return <LessonPlayer categoryId={category} lessonId={lesson} />;
}
