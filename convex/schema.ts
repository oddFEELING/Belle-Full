import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import * as schemas from "./schemas";
import { typedV } from "convex-helpers/validators";

const schema = defineSchema({
  ...authTables,
  ...schemas,
});

export default schema;

export const vv = typedV(schema);
