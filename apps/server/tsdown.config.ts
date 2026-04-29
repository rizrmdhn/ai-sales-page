import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    app: "./src/app.ts",
  },
  format: "esm",
  platform: "node",
  outDir: "./dist",
  clean: true,
  shims: true,
  noExternal: [/@ai-sales-page\/.*/],
  external: ["@node-rs/argon2"],
});
