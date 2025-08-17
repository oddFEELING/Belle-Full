import React from "react";

// ~ ======= Providers ======= ~
import AuthProvider from "./auth.provider";
import ThemeProvider from "./theme.provider";
import NuqsProvider from "./nuqs.provider";
import ConvexAppProvider from "./convex.provider";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ConvexAppProvider>
      <AuthProvider>
        <ThemeProvider>
          <NuqsProvider>{children}</NuqsProvider>
        </ThemeProvider>
      </AuthProvider>
    </ConvexAppProvider>
  );
};

export default AppProvider;
