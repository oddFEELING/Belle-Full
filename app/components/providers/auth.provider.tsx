import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type React from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};
export const convexClient = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>
  );
};

export default AuthProvider;
