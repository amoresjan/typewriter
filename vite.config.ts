import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@mocks": path.resolve(__dirname, "./src/mocks"),
      "@reducers": path.resolve(__dirname, "./src/reducers"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@app-types": path.resolve(__dirname, "./src/types"),
    },
  },
});
