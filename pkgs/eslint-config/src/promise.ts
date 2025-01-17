// @ts-expect-error -- Package lacks types
import promise from "eslint-plugin-promise"
import { composeConfigs, type Configs } from "./core.js"

const configs: Configs = composeConfigs([
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
	promise.configs["flat/recommended"],
	{
		name: "@duncan3142/eslint-config/promise",
		rules: {
			"promise/no-return-wrap": ["error", { allowReject: true }],
		},
	},
])

export default configs
