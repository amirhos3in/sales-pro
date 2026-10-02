"use client";

import { useParams } from "next/navigation";
import { TrackScreen } from "@/components/course-views";

export default function TrackPage() {
  const params = useParams<{ track: string }>();
  const track = Array.isArray(params.track) ? params.track[0] : params.track;
  return <TrackScreen slug={track} />;
}
