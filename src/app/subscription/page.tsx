import type { Metadata } from "next";
import { SubscriptionScreen } from "@/components/subscription-screen";

export const metadata: Metadata = {
  title: "قیمت | نکس‌سل",
};

export default function SubscriptionPage() {
  return <SubscriptionScreen />;
}
