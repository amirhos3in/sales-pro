import { TrackScreen } from "@/components/course-views";
import { trackStaticParams } from "@/lib/curriculum";

export function generateStaticParams() {
  return trackStaticParams();
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  return <TrackScreen slug={track} />;
}
