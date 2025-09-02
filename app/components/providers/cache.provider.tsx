import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import type React from "react";

type ConvexProviderProps = {
  children: React.ReactNode;
};

export const CacheProvider: React.FC<ConvexProviderProps> = ({ children }) => {
  return (
    <ConvexQueryCacheProvider expiration={3_600_000}>
      {children}
    </ConvexQueryCacheProvider>
  );
};

export default CacheProvider;
