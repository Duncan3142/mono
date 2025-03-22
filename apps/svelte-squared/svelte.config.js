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

/**
 * Set config property
 * @type {(obj: Record<string, unknown>) => (key: string, value: unknown) => void}
 */
const setFactory = (obj) => (key, value) => setProp(obj, key, value)

/**
 * Generate tsconfig
 * @type {(config: Record<string, any>) => Record<string, any> | void}
 */
const tsconfigGenerator = (tsconfig) => {
	const { compilerOptions, include, exclude } = tsconfig

	setProp(tsconfig, "$schema", "https://json.schemastore.org/tsconfig")
	setProp(tsconfig, "extends", ["@duncan3142/tsc-config/base"])

	const { paths, rootDirs } = compilerOptions

	const setOption = setFactory(compilerOptions)

	setOption("baseUrl", "./")
	setOption("rootDir", "${configDir}")
	setOption("outDir", "${configDir}/.tsc")
	setOption("tsBuildInfoFile", "${configDir}/.tsc/tsconfig.tsbuildinfo")
	setOption("isolatedDeclarations", false)
	setOption("allowJs", true)
	setOption("checkJs", true)
	setOption("skipLibCheck", true) // Set in base, remove
	setOption("esModuleInterop", true) // Set in base, remove
	// eslint-disable-next-line no-secrets/no-secrets -- TSConfig value
	setOption("allowSyntheticDefaultImports", true) // Set in base, remove
	setOption("allowArbitraryExtensions", true)

	Object.values(paths).forEach(insertConfigDir)

	const setPath = setFactory(paths)

	setPath("$app/*", ["${configDir}/node_modules/@sveltejs/kit/src/runtime/app/*"])
	setPath("$env/*", ["${configDir}/node_modules/@sveltejs/kit/src/runtime/env/*"])
	insertConfigDir(rootDirs)
	insertConfigDir(include)
	include.push(`${CONFIG_DIR}/*.config.js`)
	include.push(`${CONFIG_DIR}/*.config.ts`)
	include.push(`${CONFIG_DIR}/e2e/**/*.ts`)
	include.push(`${CONFIG_DIR}/.storybook/**/*.ts`)
	insertConfigDir(exclude)
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
		alias: {
			"$/*": "./src/*",
			"$components/*": "./src/components/*",
			"$features/*": "./src/features/*",
			"$io/*": "./src/io/*",
		},
		typescript: {
			config: tsconfigGenerator,
		},
	},

	extensions: [".svelte", ".svx"],
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

export default config
