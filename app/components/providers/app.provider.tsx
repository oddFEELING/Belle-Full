import React from "react";

// ~ ======= Providers ======= ~
import AuthProvider from "./auth.provider";
import ThemeProvider from "./theme.provider";
import NuqsProvider from "./nuqs.provider";
import CacheProvider from "./cache.provider";
import AppSessionProvider from "./session.provider";
import { PostHogProvider } from "./posthog.provider";
import { Toaster } from "../ui/sonner";

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
                <Toaster position="top-right" richColors closeButton />
              </ThemeProvider>
            </NuqsProvider>
          </CacheProvider>
        </AppSessionProvider>
      </AuthProvider>
    </PostHogProvider>
  );
};

export default AppProvider;
