import unicorn from "eslint-plugin-unicorn"
import { compose, filePatterns, jstsExtensions, type Config, type Configs } from "./core.ts"
import type { Guards } from "#context/lint-level"

const custom: (guard: Guards) => Config = (guard) => {
	return {
		name: "@duncan3142/eslint-config/unicorn/custom",
		rules: {
			"unicorn/no-typeof-undefined": "off",
			"unicorn/no-unnecessary-polyfills": guard.all,
		},
	}
}

const configs: (guard: Guards) => Configs = (guard) =>
	compose({
		name: "@duncan3142/eslint-config/unicorn",
		files: filePatterns(...jstsExtensions),
		extends: [unicorn.configs.recommended, custom(guard)],
	})

export default configs
