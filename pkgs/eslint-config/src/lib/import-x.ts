import importX from "eslint-plugin-import-x"

import {
	compose,
	filePatterns,
	jstsExtensions,
	type MutableConfig,
	type MutableConfigs,
} from "./core.ts"
import type { Guards } from "#context/lint-level"

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line functional/prefer-immutable-types -- Config object
const custom: (guard: Guards) => MutableConfig = (guard) => {
	return {
		name: "@duncan3142/eslint-config/import/custom",
		rules: {
			"import-x/named": "off", // tsc config
			"import-x/namespace": "off", // tsc config
			"import-x/default": "off", // tsc config
			"import-x/no-named-as-default-member": "off", // tsc config
			"import-x/no-unresolved": "off", // tsc config
			"import-x/extensions": "off", // tsc config
			"import-x/no-default-export": "off",
			"import-x/no-relative-parent-imports": "off", // Investigate further
			"import-x/no-internal-modules": "off", // Investigate further
			"import-x/no-extraneous-dependencies": "off", // Investigate further
			"import-x/no-named-as-default": guard.all,
			"import-x/prefer-default-export": "error",
			"import-x/no-empty-named-blocks": "error",
			"import-x/no-unassigned-import": "error",
			"import-x/no-anonymous-default-export": "error",
			"import-x/no-cycle": guard.all,
			"import-x/no-unused-modules": guard.all,
			"import-x/no-deprecated": guard.all,
			"import-x/no-self-import": "error",
			"import-x/no-commonjs": "error",
			"import-x/order": "error",
			"import-x/first": "error",
			"import-x/exports-last": "error",
			"import-x/newline-after-import": "error",
			"import-x/no-duplicates": "error",
			"import-x/no-absolute-path": "error",
			"import-x/no-useless-path-segments": "error",
			"import-x/group-exports": "error",
			"import-x/no-mutable-exports": "error",
		},
	}
}

/**
 * Import X config
 * @param guard - Guards
 * @returns Configs
 */
// eslint-disable-next-line functional/prefer-immutable-types -- Config object
const configs: (guard: Guards) => MutableConfigs = (guard) =>
	compose({
		name: "@duncan3142/eslint-config/import",
		files: filePatterns(...jstsExtensions),
		extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript, custom(guard)],
	})

export default configs
