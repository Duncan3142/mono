import arrow from "eslint-plugin-prefer-arrow-functions"
import { filePatterns, jstsExtensions, type Config } from "./core.ts"

const { rules } = arrow

const config: Config = {
	name: "@duncan3142/eslint-config/prefer-arrow-functions",
	files: filePatterns(...jstsExtensions),
	// @ts-expect-error -- eslint-plugin-prefer-arrow-functions is using typescript linting types
	plugins: { "prefer-arrow-functions": { rules } },
	rules: {
		"prefer-arrow-functions/prefer-arrow-functions": ["error"],
	},
}

export { config }
