import React from "react";

// ~ ======= Providers ======= ~
import AuthProvider from "./auth.provider";
import ThemeProvider from "./theme.provider";
import NuqsProvider from "./nuqs.provider";
import CacheProvider from "./cache.provider";
import AppSessionProvider from "./session.provider";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AppSessionProvider>
        <CacheProvider>
          <NuqsProvider>
            <ThemeProvider>
              <NuqsProvider>{children}</NuqsProvider>
            </ThemeProvider>
          </NuqsProvider>
        </CacheProvider>
      </AppSessionProvider>
    </AuthProvider>
  );
};

export default AppProvider;
