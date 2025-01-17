// @ts-expect-error -- Package lacks types
import promise from "eslint-plugin-promise"
import { compose, type Configs } from "./core.ts"

const configs: Configs = compose(
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Package lacks types
	promise.configs["flat/recommended"],
	{
		name: "@duncan3142/eslint-config/promise",
		rules: {
			"promise/no-return-wrap": ["error", { allowReject: true }],
		},
	}
)

export default configs
