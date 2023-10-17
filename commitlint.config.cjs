const { readdir } = require("node:fs/promises")

const getScopes = () => readdir(`${__dirname}/pkgs`).then((scopes) => ["@repo", ...scopes])

module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"scope-empty": [2, "never"],
		"scope-enum": () => Promise.all([2, "always", getScopes()]),
	},
	prompt: {
		settings: {
			enableMultipleScopes: true,
			scopeEnumSeparator: ",",
		},
	},
}
