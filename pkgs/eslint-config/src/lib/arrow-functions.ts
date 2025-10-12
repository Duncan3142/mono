import arrow from "eslint-plugin-prefer-arrow-functions"
import { filePatterns, FILE_EXTENSIONS, type Config } from "./core.ts"

const { rules } = arrow

const config: Config = {
	name: "@duncan3142/eslint-config/prefer-arrow-functions",
	files: filePatterns(...FILE_EXTENSIONS.JSTS),
	// @ts-expect-error -- eslint-plugin-prefer-arrow-functions is using typescript linting types
	plugins: { "prefer-arrow-functions": { rules } },
	rules: {
		"prefer-arrow-functions/prefer-arrow-functions": ["error"],
	},
}

export { config }
