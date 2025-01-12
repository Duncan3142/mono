import { configsArrFactory, ElementMode } from "#config"

export default configsArrFactory({
	boundaries: {
		elements: [
			{ type: "src", pattern: "src/**" },
			{ type: "cnfg", pattern: [".prettierrc.js", "*.config.js"], mode: ElementMode.File },
		],
		rules: [
			{
				from: "cnfg",
				allow: ["src"],
			},
		],
	},
})
