import React from "react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { ConvexProvider, ConvexReactClient } from "convex/react";

type ConvexProviderProps = {
  children: React.ReactNode;
};

export const CacheProvider: React.FC<ConvexProviderProps> = ({ children }) => {
  return (
    <ConvexQueryCacheProvider expiration={3600000}>
      {children}
    </ConvexQueryCacheProvider>
  );
};

export default CacheProvider;
