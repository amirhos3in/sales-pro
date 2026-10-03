"use client";

import { AuthProvider } from "@/context/AuthContext";
import { GateProvider } from "@/components/gates";
import { SupportWidget } from "@/components/support-widget";
import { Toaster } from "@/components/ui/sonner";
import { useI18n } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { WalletProvider } from "@/lib/walletContext";
import { ThemeProvider, useThemeMode } from "@/lib/theme";

function ToastHost() {
  const { dir } = useI18n();
  const { theme } = useThemeMode();
  return <Toaster dir={dir} position="top-center" theme={theme} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <StoreProvider>
          <AuthProvider>
          <WalletProvider>
          <GateProvider>
            {children}
            <SupportWidget />
            <ToastHost />
          </GateProvider>
          </WalletProvider>
          </AuthProvider>
        </StoreProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
