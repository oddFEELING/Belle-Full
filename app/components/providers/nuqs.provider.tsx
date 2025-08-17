import React from "react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

type NuqsProviderProps = {
  children: React.ReactNode;
};

export const NuqsProvider: React.FC<NuqsProviderProps> = ({ children }) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export default NuqsProvider;
