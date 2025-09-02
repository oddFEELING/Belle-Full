import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { typedV } from "convex-helpers/validators";
import * as schemas from "./schemas";

const schema = defineSchema({
  ...authTables,
  ...schemas,
});

export default schema;

export const vv = typedV(schema);
