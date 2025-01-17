// @ts-expect-error -- Package lacks types
// eslint-disable-next-line import/no-internal-modules -- Package lacks sufficient exports
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"
import { compose, type Configs } from "./core.js"

const configs: Configs = compose([
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Package lacks types
	comments.recommended,
	{
		name: "@duncan3142/eslint-config/comments",
		rules: {
			"@eslint-community/eslint-comments/require-description": "error",
		},
	},
])

export default configs
