/** @type {import('eslint').Linter.Config} */
const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2022,
	},
	reportUnusedDisableDirectives: true,
	ignorePatterns: ["!.eslintrc.cjs", "node_modules"],
	env: {
		node: true,
	},
	plugins: ["@typescript-eslint", "eslint-comments", "import", "promise"],
	extends: [
		"eslint:recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:promise/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/strict",
		"plugin:eslint-comments/recommended",
		"prettier",
	],
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts"],
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	rules: {
		"default-case": "off",
		"prefer-destructuring": "error",
		"object-shorthand": ["error", "always"],
		"consistent-return": "off",
		"arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
		"prefer-arrow-callback": "error",
		"no-underscore-dangle": "off",
		"no-await-in-loop": "error",
		"no-continue": "off",
		"no-nested-ternary": "off",
		"no-restricted-syntax": [
			"error",
			{
				selector: "ForInStatement",
				message:
					"for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
			},
			{
				selector: "LabeledStatement",
				message:
					"Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
			},
			{
				selector: "WithStatement",
				message:
					"`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
			},
		],
		"import/prefer-default-export": "off",
		"import/no-default-export": "off",
		"import/no-unresolved": "error",
		"import/extensions": "off",
		"import/no-cycle": "error",
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: false,
				optionalDependencies: false,
				peerDependencies: true,
				bundledDependencies: false,
			},
		],
		"@typescript-eslint/consistent-type-definitions": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-declaration-merging": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/prefer-for-of": "off",
		"@typescript-eslint/switch-exhaustiveness-check": "error",
		"@typescript-eslint/array-type": ["error", { default: "generic" }],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-use-before-define": ["error"],
		"@typescript-eslint/no-empty-interface": [
			"error",
			{
				allowSingleExtends: true,
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],
		"promise/no-return-wrap": ["error", { allowReject: true }],
	},
	overrides: [
		{
			files: ["*.js"],
			rules: {
				"@typescript-eslint/explicit-module-boundary-types": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
			},
		},
		{
			files: ["*.cjs"],
			rules: {
				// Allow `require()`
				"@typescript-eslint/no-var-requires": "off",
			},
		},
		{
			files: [".eslintrc.*", "*.spec.*", "*.config.*"],
			rules: {
				// Allow build / test files to load dev deps
				"import/no-extraneous-dependencies": "off",
			},
		},
	],
}

module.exports = config
