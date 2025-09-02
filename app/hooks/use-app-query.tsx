import { useQueries } from "convex/react";
import { makeUseQueryWithStatus } from "convex-helpers/react";
import { useQueries as useCachedQueries } from "convex-helpers/react/cache";

const useAppQuery = makeUseQueryWithStatus(useQueries);
const useCachedQuery = makeUseQueryWithStatus(useCachedQueries);

export { useAppQuery, useCachedQuery };
