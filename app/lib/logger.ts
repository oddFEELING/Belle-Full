import pino from "pino";

const logger = pino({
  base: null,
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
  },
});

export { logger };
