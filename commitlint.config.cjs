const { readdir } = require("node:fs/promises")

module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			["feat", "fix", "docs", "format", "refactor", "test", "build", "tool", "deps", "revert"],
		],
		"scope-empty": [2, "always"],
	},
	prompt: {
		settings: {},
		questions: {
			type: {
				description: "Select the type of change that you're committing",
				enum: {
					feat: {
						description: "A new feature",
						title: "Feature",
						emoji: "✨",
					},
					fix: {
						description: "A bug fix",
						title: "Bug Fix",
						emoji: "🐛",
					},
					docs: {
						description: "Documentation only changes",
						title: "Documentation",
						emoji: "📚",
					},
					format: {
						description:
							"Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
						title: "Format",
						emoji: "💎",
					},
					refactor: {
						description:
							"A code change that neither fixes a bug nor adds a feature (file structure, performance optimization, etc))",
						title: "Refactor",
						emoji: "📦",
					},
					test: {
						description: "Adding missing tests or correcting existing tests",
						title: "Test",
						emoji: "🚨",
					},
					build: {
						description: "Changes that affect the build system or CI workflows",
						title: "Build",
						emoji: "👷",
					},
					tool: {
						description: "Changes that affect the dev tooling",
						title: "Tool",
						emoji: "🔧",
					},
					deps: {
						description: "Changes to our package dependencies",
						title: "Dependencies",
						emoji: "📦",
					},
					revert: {
						description: "Reverts a previous commit",
						title: "Reverts",
						emoji: "🗑",
					},
				},
			},
		},
	},
}
