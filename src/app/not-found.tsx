import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-card p-6 text-center ring-1 ring-foreground/10">
      <h1 className="text-xl font-semibold">صفحه پیدا نشد</h1>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        از خانه یا چهار مسیر آموزشی ادامه دهید.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-4 h-10 px-4")}>
        خانه
      </Link>
    </div>
  );
}
