import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ["posthog-js", "posthog-js/react"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "db.types": path.resolve(__dirname, "./db.types.ts"),
    },
  },
});
