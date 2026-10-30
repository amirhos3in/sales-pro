import type { Metadata } from "next";
import { HomeScreen } from "@/components/home-screen";

export const metadata: Metadata = {
  title: "نکس‌سل | آکادمی فروش",
};

export default function Home() {
  return <HomeScreen />;
}
