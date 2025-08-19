/**
 * To set up R2, run the following commands:
 *
 * pnpm dlx convex env set R2_TOKEN xxxxx
 * pnpm dlx convex env set R2_ACCESS_KEY_ID xxxxx
 * pnpm dlx convex env set R2_SECRET_ACCESS_KEY xxxxx
 * pnpm dlx convex env set R2_ENDPOINT xxxxx
 * pnpm dlx convex env set R2_BUCKET xxxxx
 */

import { R2 } from "@convex-dev/r2";
import { components } from "../_generated/api";

export const r2 = new R2(components.r2);
