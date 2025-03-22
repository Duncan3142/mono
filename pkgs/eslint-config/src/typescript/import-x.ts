import importX from "eslint-plugin-import-x"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

import { TS_CONFIG_DEFAULT } from "./paths.ts"
import {
	compose,
	filePatterns,
	jsonExtensions,
	jstsExtensions,
	nodeExtensions,
	type Config,
	type Configs,
	type Patterns,
} from "#core"

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

const extraExtensions: Patterns = [...jsonExtensions, ...nodeExtensions]

const custom: Config = {
	name: "@duncan3142/eslint-config/import/custom",
	settings: {
		"import-x/resolver-next": [
			createTypeScriptImportResolver({
				alwaysTryTypes: true,
				project: TS_CONFIG_DEFAULT,
				extensions: [...jstsExtensions, ...extraExtensions],
			}),
		],
	},
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
		"import-x/no-named-as-default": "error",
		"import-x/prefer-default-export": "error",
		"import-x/no-empty-named-blocks": "error",
		"import-x/no-unassigned-import": "error",
		"import-x/no-anonymous-default-export": "error",
		"import-x/no-cycle": "error",
		"import-x/no-unused-modules": "error",
		"import-x/no-deprecated": "error",
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

/**
 * Import X config
 */
const configs: Configs = compose({
	name: "@duncan3142/eslint-config/import",
	files: filePatterns(...jstsExtensions),
	extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript, custom],
})

export default configs
