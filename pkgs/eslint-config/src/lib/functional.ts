import functional from "eslint-plugin-functional"
import {
	compose,
	filePatterns,
	jsExtensions,
	jstsExtensions,
	type MutableConfig,
	type MutableConfigs,
} from "./core.ts"

/**
 * ImmutableArray type
 */
type ImmutableArray<E> =
	Readonly<E> extends infer Element
		? ReadonlyArray<Element> extends infer InferredArray
			? {
					readonly [P in keyof InferredArray & {}]: InferredArray[P]
				}
			: never
		: never

const custom: Readonly<MutableConfig> = {
	name: "@duncan3142/eslint-config/functional/custom",
	rules: {
		"functional/no-try-statements": "off",
		"functional/functional-parameters": "off",
		"functional/prefer-immutable-types": [
			"error",
			{ enforcement: "ReadonlyDeep", ignoreTypePattern: "^Mutable.*" },
		],
		"functional/type-declaration-immutability": [
			"error",
			{
				rules: [
					{
						identifiers: "^(?!Mutable).*",
						immutability: "ReadonlyDeep",
						comparator: "AtLeast",
						fixer: false,
						suggestions: false,
					},
				],
				ignoreInterfaces: false,
			},
		],
	},
}

const configs: MutableConfigs = compose(
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

export type { ImmutableArray }
export default configs
