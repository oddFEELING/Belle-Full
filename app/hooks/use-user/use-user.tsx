import { api } from "convex/_generated/api";
import { useAppQuery } from "../use-app-query";

const useUser = () => {
  const {
    data: user,
    isPending: userIsPending,
    ...rest
  } = useAppQuery(api.users.functions.getUserSession);

  return {
    user,
    isPending: userIsPending,
    ...rest,
  };
};

export { useUser };
