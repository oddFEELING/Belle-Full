import { SessionProvider } from "convex-helpers/react/sessions";
import type React from "react";

type AppSessionProvider = {
  children: React.ReactNode;
};

const AppSessionProvider: React.FC<AppSessionProvider> = ({ children }) => {
  return <SessionProvider ssrFriendly>{children}</SessionProvider>;
};

export default AppSessionProvider;
