export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			["feat", "fix", "docs", "format", "refactor", "test", "ci", "tools", "deps", "revert"],
		],
		"scope-empty": [2, "always"],
	},
}
