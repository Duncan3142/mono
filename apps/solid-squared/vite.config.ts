import { paraglide as paraglideFactory } from "@inlang/paraglide-sveltekit/vite"
import { defineConfig } from "vitest/config"
import { sveltekit } from "@sveltejs/kit/vite"
import type { Plugin } from "vite"
import UnoCSS from 'unocss/vite';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package uses 'any' type
const paraglide: Plugin = paraglideFactory({
	project: "./project.inlang",
	outdir: "./src/lib/paraglide",
})

export default defineConfig({
	plugins: [UnoCSS(), sveltekit(), paraglide],
	test: {
		environment: "jsdom",
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
})
