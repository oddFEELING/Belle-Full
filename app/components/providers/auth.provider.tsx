import React from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convexClient } from "./convex.provider";

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>
  );
};

export default AuthProvider;
