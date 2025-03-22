import { defineConfig } from "vite"
import unoCSS from "unocss/vite"
import solid from "vite-plugin-solid"
import { paraglideVitePlugin as paraglide } from "@inlang/paraglide-js"

export default defineConfig({
	plugins: [
		unoCSS(),
		solid(),
		paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
		}),
	],
	test: {
		environment: "jsdom",
		include: ["src/**/*.{test,spec}.{js,ts}"],
		setupFiles: ["node_modules/@testing-library/jest-dom/vitest"],
	},
})
