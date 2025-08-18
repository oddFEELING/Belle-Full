import pino, {
  type TransportBaseOptions,
  type TransportTargetOptions,
} from "pino";

const logger = pino({
  level: import.meta.env.VITE_NODE_ENV === "development" ? "debug" : "info",
  transport:
    import.meta.env.VITE_NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  browser: {
    asObject: true,
    transmit: {
      send: (level, event) => {
        // TODO: Send to External Logger
        // console.log(event.messages);
      },
    },
  },
});

export { logger };
