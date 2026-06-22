import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine = Object.fromEntries(
    Object.entries(loadedEnv).map(([key, value]) => [
      `import.meta.env.${key}`,
      JSON.stringify(value),
    ]),
  );

  return {
    base: "/mais-kontak/",
    css: { transformer: "lightningcss" },
    define: envDefine,
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    build: {
      outDir: "dist/pages",
      emptyOutDir: true,
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "pages/index.html"),
        },
      },
    },
    plugins: [tailwindcss(), react()],
  };
});
