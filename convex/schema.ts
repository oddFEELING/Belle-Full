import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";   
import * as schemas from './schemas'

const schema = defineSchema({
  ...authTables,
  ...schemas,
})


export default schema;