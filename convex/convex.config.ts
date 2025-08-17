import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import workflow from "@convex-dev/workflow/convex.config";
import crons from "@convex-dev/crons/convex.config";
import rag from "@convex-dev/rag/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import twilio from "@convex-dev/twilio/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();

app.use(agent);
app.use(workflow);
app.use(crons);
app.use(rag);
app.use(r2);
app.use(twilio);
app.use(resend);

export default app;
