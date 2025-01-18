import { mdsvex } from "mdsvex"
import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

// eslint-disable-next-line jsdoc/check-tag-names -- Required in JS
/** @type {import('@sveltejs/kit').Config} */
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
				const insertConfigDir = (path, container, index) => {
					if (path.startsWith(PARENT_DIR)) {
						container[index] = `${CONFIG_DIR}${path.slice(PARENT_DIR.length)}`
					}
				}

				const insertConfigDirs = (array) => {
					array.forEach((path, index) => {
						insertConfigDir(path, array, index)
					})
				}

				Object.values(paths).forEach(insertConfigDirs)
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

export default config
