import arrow from "eslint-plugin-prefer-arrow-functions"
import { filePatterns, jstsExtensions, type MutableConfig } from "./core.ts"

const { rules } = arrow

const custom: MutableConfig = {
	name: "@duncan3142/eslint-config/prefer-arrow-functions",
	files: filePatterns(...jstsExtensions),
	plugins: { "prefer-arrow-functions": { rules } },
	rules: {
		"prefer-arrow-functions/prefer-arrow-functions": ["error"],
	},
}

export default custom
