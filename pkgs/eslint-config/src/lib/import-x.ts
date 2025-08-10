import { importX } from "eslint-plugin-import-x"

import { compose, filePatterns, jstsExtensions, type Config, type Configs } from "./core.ts"
import type { LintLevel } from "#context"

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

const custom: (guard: LintLevel.Guards) => Config = (guard) => {
	return {
		name: "@duncan3142/eslint-config/import/custom",
		rules: {
			"import-x/named": "off", // tsc config
			"import-x/namespace": "off", // tsc config
			"import-x/default": "off", // tsc config
			"import-x/no-anonymous-default-export": "off",
			"import-x/no-default-export": "error",
			"import-x/no-named-as-default-member": "off", // tsc config
			"import-x/no-named-as-default": guard.all,
			"import-x/prefer-default-export": "off",
			"import-x/no-unresolved": "off", // tsc config
			"import-x/extensions": "off", // tsc config
			"import-x/no-relative-parent-imports": "off", // Investigate further
			"import-x/no-internal-modules": "off", // Investigate further
			"import-x/no-extraneous-dependencies": "off", // Investigate further
			"import-x/no-empty-named-blocks": "error",
			"import-x/no-unassigned-import": "error",
			"import-x/no-cycle": guard.all,
			"import-x/no-unused-modules": guard.all,
			"import-x/no-deprecated": guard.all,
			"import-x/no-self-import": "error",
			"import-x/no-commonjs": "error",
			"import-x/order": "error",
			"import-x/first": "error",
			"import-x/exports-last": "error",
			"import-x/newline-after-import": "error",
			"import-x/no-duplicates": ["error", { "prefer-inline": true }],
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
const config: (guard: LintLevel.Guards) => Configs = (guard) =>
	compose({
		name: "@duncan3142/eslint-config/import",
		files: filePatterns(...jstsExtensions),
		extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript, custom(guard)],
	})

export { config }
