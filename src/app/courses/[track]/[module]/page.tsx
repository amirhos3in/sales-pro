"use client";

import { useParams } from "next/navigation";
import { ModuleScreen } from "@/components/course-views";

export default function ModulePage() {
  const params = useParams<{ track: string; module: string }>();
  const track = one(params.track);
  const moduleSlug = one(params.module);
  return <ModuleScreen trackSlug={track} moduleSlug={moduleSlug} />;
}

function one(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
