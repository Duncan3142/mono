import { configsArrFactory, ElementMode } from "#config"

export default configsArrFactory({
	boundaries: {
		settings: {
			elements: [
				{ type: "cnfg", pattern: [".*", "*"], mode: ElementMode.Full },
				{ type: "src", pattern: ["src"], mode: ElementMode.Folder },
			],
		},
		rules: {
			elements: [
				{
					from: ["cnfg"],
					allow: ["src"],
				},
				{
					from: ["src"],
					allow: ["src"],
				},
			],
			entry: [
				{
					target: ["src"],
					allow: ["eslint.config.ts"],
				},
			],
			external: [
				{ from: ["*"], allow: ["node:*"] },
				{
					from: ["cnfg"],
					allow: ["@duncan3142/prettier-config"],
				},
				{
					from: ["src"],
					allow: [
						"eslint",
						"@eslint/*",
						"eslint-config-*",
						"eslint-plugin-*",
						"typescript-eslint",
						"@typescript-eslint/*",
						"@eslint-community/*",
					],
				},
			],
		},
	},
})
