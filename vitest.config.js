import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enables Jest globals
    environment: "jsdom", // Sets the environment to simulate a browser
  },
});
