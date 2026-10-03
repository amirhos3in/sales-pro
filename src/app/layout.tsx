import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeBoot = `(function(){try{var t=localStorage.getItem("nexsell-theme");var l=localStorage.getItem("nexsell-lang");var root=document.documentElement;if(t==="light"){root.classList.remove("dark")}else{root.classList.add("dark")}if(l==="en"){root.lang="en";root.dir="ltr";root.classList.add("font-en")}else{root.lang="fa";root.dir="rtl";root.classList.remove("font-en")}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "نکس‌سل | آکادمی تخصصی مهارت‌های فروش",
  description:
    "آموزش سناریومحور فروش حضوری، مذاکره، تماس تلفنی و فروش در شبکه‌های اجتماعی.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={`${vazir.variable} ${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
