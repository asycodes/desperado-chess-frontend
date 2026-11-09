import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
  test: {
  environment: "jsdom",
  setupFiles: ["./app/test/setup.ts"],
  globals: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
