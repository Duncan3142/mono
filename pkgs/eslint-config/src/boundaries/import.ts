import importX from "eslint-plugin-import-x"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

import { TS_CONFIGS_DEFAULT } from "#typescript"
import {
	compose,
	filePatterns,
	jsExtensions,
	tsExtensions,
	type Configs,
	type Paths,
} from "#core"

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

/**
 * Config array factory options
 */
interface Options {
	tsConfigs: Paths
}

const defaultOptions: Options = {
	tsConfigs: TS_CONFIGS_DEFAULT,
}

/**
 * Boundaries config
 * @param opts - options
 * @param opts.tsConfigs - tsconfig paths
 * @returns ESLint configs
 */
const configs = ({ tsConfigs }: Options = defaultOptions): Configs =>
	compose(importX.flatConfigs.recommended, importX.flatConfigs.typescript, {
		name: "@duncan3142/eslint-config/import",
		files: filePatterns(tsExtensions, jsExtensions),
		settings: {
			"import/resolver-next": [
				createTypeScriptImportResolver({ alwaysTryTypes: true, project: tsConfigs }),
				{ node: true },
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
	})

export { defaultOptions }
export default configs
export type { Options }
