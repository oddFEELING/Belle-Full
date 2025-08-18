import React, { useCallback } from "react";
import { useAppQuery } from "~/hooks/use-app-query";
import { useSessionId } from "convex-helpers/react/sessions";
import type { Id } from "convex/_generated/dataModel";
import { useEffect } from "react";
import { api } from "convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { logger } from "~/lib/logger";
import { useQuery } from "convex/react";

const useAnonUserCheck = () => {
  const { signIn } = useAuthActions();
  const [sessionId, refreshSession] = useSessionId();
  const data = useQuery(api.users.getUserSession);

  const anonCheck = useCallback(async () => {
    console.log(data, sessionId);
    if (data === null) {
      await signIn("anonymous").then(async () => {
        logger.info("New Anonymous user created.");
      });
    }
  }, [data, signIn, refreshSession]);

  useEffect(() => {
    anonCheck();
  }, [data, anonCheck]);

  return { data };
};

export { useAnonUserCheck };
