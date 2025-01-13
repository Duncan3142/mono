import { configsArrFactory, ElementMode } from "#config"

export default configsArrFactory({
	boundaries: {
		elements: [
			{ type: "src", pattern: "src", mode: ElementMode.Folder },
			{ type: "cnfg", pattern: [".*", "*"], mode: ElementMode.Full },
		],
		rules: [
			{
				from: "cnfg",
				allow: ["src"],
			},
		],
	},
})
