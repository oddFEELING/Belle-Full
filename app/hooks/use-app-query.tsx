import { useQueries } from "convex/react";
import { useQueries as useCachedQueries } from "convex-helpers/react/cache";
import { makeUseQueryWithStatus } from "convex-helpers/react";

const useAppQuery = makeUseQueryWithStatus(useQueries);
const useCachedQuery = makeUseQueryWithStatus(useCachedQueries);

export { useAppQuery, useCachedQuery };
