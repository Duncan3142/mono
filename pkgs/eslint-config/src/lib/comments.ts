// @ts-expect-error -- Package lacks types
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"
import { compose, type Config, type Configs } from "./core.ts"

const custom: Config = {
	name: "@duncan3142/eslint-config/comments/custom",
	rules: {
		"@eslint-community/eslint-comments/require-description": "error",
	},
}

const configs: Configs = compose({
	name: "@duncan3142/eslint-config/comments",
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Package lacks types
	extends: [
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
		comments.recommended,
		custom,
	],
})

export default configs
