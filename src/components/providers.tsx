"use client";

import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <Toaster dir="rtl" position="top-center" />
    </StoreProvider>
  );
}
