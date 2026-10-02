"use client";

import { useParams } from "next/navigation";
import { LessonScreen } from "@/components/course-views";

export default function LessonPage() {
  const params = useParams<{ track: string; module: string; lesson: string }>();
  return (
    <LessonScreen
      trackSlug={one(params.track)}
      moduleSlug={one(params.module)}
      lessonSlug={one(params.lesson)}
    />
  );
}

function one(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
