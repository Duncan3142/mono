import functional from "eslint-plugin-functional"
import {
	compose,
	filePatterns,
	jsExtensions,
	jstsExtensions,
	type Config,
	type Configs,
} from "./core.ts"

const custom: Readonly<Config> = {
	name: "@duncan3142/eslint-config/functional/custom",
	rules: {
		"functional/no-try-statements": "off",
		"functional/functional-parameters": "off",
		"functional/prefer-immutable-types": ["error", { enforcement: "ReadonlyDeep" }],
	},
}

const configs: Configs = compose(
	{
		name: "@duncan3142/eslint-config/functional",
		files: filePatterns(...jstsExtensions),
		extends: [functional.configs.strict, functional.configs.stylistic, custom],
	},
	{
		name: "@duncan3142/eslint-config/functional/no-types",
		files: filePatterns(...jsExtensions),
		extends: [functional.configs.disableTypeChecked],
	}
)

export default configs
