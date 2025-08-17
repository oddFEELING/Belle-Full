import React from "react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { ConvexProvider, ConvexReactClient } from "convex/react";

type ConvexProviderProps = {
  children: React.ReactNode;
};

export const convexClient = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL,
);

export const ConvexAppProvider: React.FC<ConvexProviderProps> = ({
  children,
}) => {
  return (
    <ConvexProvider client={convexClient}>
      <ConvexQueryCacheProvider expiration={3600000}>
        {children}
      </ConvexQueryCacheProvider>
    </ConvexProvider>
  );
};

export default ConvexAppProvider;
