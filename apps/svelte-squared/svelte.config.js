// @ts-expect-error - Package lack correct exports
import { mdsvex } from "mdsvex"
import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/**
 * @import { Config as SvelteConfig } from "@sveltejs/kit"
 */

/* eslint-disable jsdoc/check-tag-names -- Type required in JS */
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
				const { paths, rootDirs } = compilerOptions
				const CONFIG_DIR = "${configDir}"
				const PARENT_DIR = ".."

				compilerOptions.baseUrl = "./"

				/**
				 * Insert the config directory in the path
				 * @type {(path: string, container: Array<string>, index: number) => void}
				 */
				const insertConfigDir = (path, container, index) => {
					if (path.startsWith(PARENT_DIR)) {
						container[index] = `${CONFIG_DIR}${path.slice(PARENT_DIR.length)}`
					}
				}

				/**
				 * Insert the config directory in paths
				 * @type {(container: Array<string>) => void}
				 */
				const insertConfigDirs = (array) => {
					array.forEach((path, index) => {
						insertConfigDir(path, array, index)
					})
				}

				Object.values(paths).forEach(insertConfigDirs)

				paths["$app/*"] = [`${CONFIG_DIR}/node_modules/@sveltejs/kit/src/runtime/app/*`]
				paths["$env/*"] = [`${CONFIG_DIR}/node_modules/@sveltejs/kit/src/runtime/env/*`]
				insertConfigDirs(rootDirs)
				insertConfigDirs(include)
				include.push(`${CONFIG_DIR}/*.config.js`)
				include.push(`${CONFIG_DIR}/*.config.ts`)
				include.push(`${CONFIG_DIR}/e2e/**/*.ts`)
				insertConfigDirs(exclude)
			},
		},
	},

	extensions: [".svelte", ".svx"],
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

export default config
