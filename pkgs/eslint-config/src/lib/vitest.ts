import vitest from "@vitest/eslint-plugin"
import { compose, type Configs, FILE_EXTENSIONS } from "./core.ts"

const config: Configs = compose({
	name: "@duncan3142/eslint-config/jsdoc",
	files: [`**/test/**/*.{test,spec}{${FILE_EXTENSIONS.JSTS.join(",")}}`],
	// @ts-expect-error -- Broken Vitest types
	extends: [vitest.configs.recommended],
})

export { config }
