import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
  profile(params, ctx) {
    return {
      email: params.email as string,
      name: params.name as string,
      isActive: true,
      phone: params.phone as string,
    };
  },
});
