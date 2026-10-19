import type { Metadata } from "next";
import { AcademyPath } from "@/components/academy/AcademyPath";

export const metadata: Metadata = {
  title: "مسیر آموزش فروش | نکس‌سل",
  description: "چهار دورهٔ فروش آنلاین، حضوری، تلفنی و مذاکره با قفل پلن و آزمون مرحله‌ای.",
};

export default function AcademyPage() {
  return <AcademyPath />;
}
