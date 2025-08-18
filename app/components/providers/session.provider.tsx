import React from "react";
import { SessionProvider } from "convex-helpers/react/sessions";

type AppSessionProvider = {
  children: React.ReactNode;
};

const AppSessionProvider: React.FC<AppSessionProvider> = ({ children }) => {
  return <SessionProvider ssrFriendly>{children}</SessionProvider>;
};

export default AppSessionProvider;
