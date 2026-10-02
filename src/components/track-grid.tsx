import Link from "next/link";
import { Handshake, Megaphone, Phone, Users, type LucideIcon } from "lucide-react";
import { tracks, type TrackIcon } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

const icons: Record<TrackIcon, LucideIcon> = {
  users: Users,
  handshake: Handshake,
  phone: Phone,
  megaphone: Megaphone,
};

export function TrackIconBadge({
  icon,
  className,
}: {
  icon: TrackIcon;
  className?: string;
}) {
  const Icon = icons[icon];
  return (
    <span
      className={cn(
        "grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <Icon className="size-7" />
    </span>
  );
}

export function TrackGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tracks.map((track) => (
        <Link
          key={track.slug}
          href={`/courses/${track.slug}`}
          className="group flex flex-col items-center gap-3 rounded-3xl bg-card px-3 py-5 text-center ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:ring-primary/40"
        >
          <TrackIconBadge
            icon={track.icon}
            className="transition group-hover:scale-105"
          />
          <span className="text-sm font-semibold leading-6">{track.title}</span>
          {compact ? null : (
            <span className="text-xs leading-5 text-muted-foreground">
              {track.subtitle}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
