import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نکس‌سل | آکادمی تخصصی مهارت‌های فروش",
  description:
    "آموزش سناریومحور فروش حضوری، مذاکره، تماس تلفنی و فروش در شبکه‌های اجتماعی.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
