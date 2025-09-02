import type React from "react";
import { Toaster } from "../ui/sonner";
// ~ ======= Providers ======= ~
import AuthProvider from "./auth.provider";
import CacheProvider from "./cache.provider";
import NuqsProvider from "./nuqs.provider";
import { PostHogProvider } from "./posthog.provider";
import AppSessionProvider from "./session.provider";
import ThemeProvider from "./theme.provider";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <PostHogProvider>
      <AuthProvider>
        <AppSessionProvider>
          <CacheProvider>
            <NuqsProvider>
              <ThemeProvider>
                {children}
                <Toaster closeButton position="top-right" richColors />
              </ThemeProvider>
            </NuqsProvider>
          </CacheProvider>
        </AppSessionProvider>
      </AuthProvider>
    </PostHogProvider>
  );
};

export default AppProvider;
