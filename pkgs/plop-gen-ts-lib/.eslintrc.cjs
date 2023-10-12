const project = [
	`${__dirname}/tsconfig.base.json`,
	`${__dirname}/tsconfig.config.json`,
	`${__dirname}/tsconfig.build.json`,
	`${__dirname}/tsconfig.test.json`,
	`${__dirname}/tsconfig.json`,
]

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: ["@duncan3142"],
	ignorePatterns: ["assets"],
	parserOptions: {
		project,
	},
	settings: {
		"import/resolver": {
			typescript: {
				project,
			},
			node: {
				project,
			},
		},
	},
}
