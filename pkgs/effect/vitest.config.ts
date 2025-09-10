import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

// eslint-disable-next-line import-x/no-default-export -- Vitest config
export default defineConfig({
	test: {},
	plugins: [tsconfigPaths()],
})
