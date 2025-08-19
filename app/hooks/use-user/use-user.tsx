import { api } from "convex/_generated/api";
import { useAppQuery } from "../use-app-query";

export const useUser = () => {
  const { data: session, isPending: sessionIsLoading } = useAppQuery(
    api.users.functions.getUserSession,
  );

  return {
    user: session?.user,
    session: session?.session,
    isLoading: sessionIsLoading,
  };
};
