// @ts-expect-error -- Package lacks types
import promise from "eslint-plugin-promise"
import { compose, filePatterns, jstsExtensions, type Config, type Configs } from "./core.ts"

const custom: Config = {
	name: "@duncan3142/eslint-config/promise/custom",
	rules: {
		"promise/no-return-wrap": ["error", { allowReject: true }],
	},
}

const configs: Configs = compose({
	name: "@duncan3142/eslint-config/promise",
	files: filePatterns(...jstsExtensions),
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
	extends: [
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		promise.configs["flat/recommended"],
		custom,
	],
})

export default configs
