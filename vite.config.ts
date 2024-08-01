import { defineConfig } from "vite";
import * as path from "path";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/

export default defineConfig({
  server: {
    watch: {
      ignored: ["./node_modules"],
    },
  },
  build: {
    rollupOptions: {},
  },
  plugins: [vue()],
  resolve: {
    alias: {
      find: "@",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
