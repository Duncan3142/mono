// @ts-expect-error - Package lack correct exports
import { mdsvex } from "mdsvex"
import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/**
 * @import { Config as SvelteConfig } from "@sveltejs/kit"
 */

/* eslint-disable jsdoc/check-tag-names -- Type required in JS */

const CONFIG_DIR = "${configDir}"
const PARENT_DIR = ".."

/**
 * Insert the config directory in paths
 * @type {(container: Array<string>) => void}
 */
const insertConfigDir = (array) => {
	array.forEach((path, index) => {
		if (path.startsWith(PARENT_DIR)) {
			array[index] = `${CONFIG_DIR}${path.slice(PARENT_DIR.length)}`
		}
	})
}

/**
 * Set config property
 * @type {(obj: Record<string, unknown>, key: string, value: unknown) => void}
 */
const setProp = (obj, key, value) => {
	if (typeof obj[key] !== "undefined") {
		throw new Error(`'${key}' already set`)
	}
	obj[key] = value
}

/** @type { SvelteConfig } */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			out: ".build",
		}),
		typescript: {
			config: (tsconfig) => {
				const { compilerOptions, include, exclude } = tsconfig

				setProp(tsconfig, "$schema", "https://json.schemastore.org/tsconfig")
				setProp(tsconfig, "extends", ["@duncan3142/tsc-config/base"])

				const { paths, rootDirs } = compilerOptions

				setProp(compilerOptions, "baseUrl", "./")
				setProp(compilerOptions, "rootDir", "${configDir}")
				setProp(compilerOptions, "outDir", "${configDir}/.tsc")
				setProp(compilerOptions, "tsBuildInfoFile", "${configDir}/.tsc/tsconfig.tsbuildinfo")
				setProp(compilerOptions, "isolatedDeclarations", false)
				setProp(compilerOptions, "allowJs", true)
				setProp(compilerOptions, "checkJs", true)
				setProp(compilerOptions, "skipLibCheck", true)
				setProp(compilerOptions, "esModuleInterop", true)
				// eslint-disable-next-line no-secrets/no-secrets -- TSConfig value
				setProp(compilerOptions, "allowSyntheticDefaultImports", true)

				Object.values(paths).forEach(insertConfigDir)

				setProp(paths, "$app/*", ["${configDir}/node_modules/@sveltejs/kit/src/runtime/app/*"])
				setProp(paths, "$env/*", ["${configDir}/node_modules/@sveltejs/kit/src/runtime/env/*"])
				insertConfigDir(rootDirs)
				insertConfigDir(include)
				include.push(`${CONFIG_DIR}/*.config.js`)
				include.push(`${CONFIG_DIR}/*.config.ts`)
				include.push(`${CONFIG_DIR}/e2e/**/*.ts`)
				insertConfigDir(exclude)
			},
		},
	},

	extensions: [".svelte", ".svx"],
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

export default config
