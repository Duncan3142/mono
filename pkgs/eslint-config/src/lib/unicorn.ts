import unicorn from "eslint-plugin-unicorn"
import {
	compose,
	filePatterns,
	jstsExtensions,
	type MutableConfig,
	type MutableConfigs,
} from "./core.ts"
import type { Guards } from "#context/lint-level"

const custom: (guard: Guards) => MutableConfig = (guard) => {
	return {
		name: "@duncan3142/eslint-config/unicorn/custom",
		rules: {
			"unicorn/no-typeof-undefined": "off",
			"unicorn/no-unnecessary-polyfills": guard.all,
			"unicorn/import-style": "off",
		},
	}
}

/**
 * Unicorn ESLint config
 * @param guard - Guards
 * @returns Configs
 */
const configs: (guard: Guards) => MutableConfigs = (guard) =>
	compose({
		name: "@duncan3142/eslint-config/unicorn",
		files: filePatterns(...jstsExtensions),
		extends: [unicorn.configs.recommended, custom(guard)],
	})

export default configs
