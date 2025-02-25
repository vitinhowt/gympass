import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [["src/http/controllers/**", "prisma"]],
    dir: "src",
    coverage: {
      provider: "v8",
      include: ["src/usecases/**", "src/http/controllers/**/*.ts"], // Adiciona use-cases explicitamente
      exclude: ["**/*.test.ts", "**/*.spec.ts","src/http/controllers/**/route.ts", "src/usecases/errors/*.ts", "src/usecases/factories"], // Exclui arquivos de teste
      all: true, // Garante que arquivos não testados apareçam no relatório
      reporter: ["text", "html", "lcov"],
    },
  },
});
