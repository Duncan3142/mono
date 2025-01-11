import { configsArrFactory } from "#config"

export default configsArrFactory({
	boundaries: {
		elements: [
			{ type: "src", pattern: "src/**" },
			{ type: "cnfg", pattern: "./*" },
		],
		rules: [
			{
				from: "cnfg",
				allow: ["src"],
			},
		],
	},
})
