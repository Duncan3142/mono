import vitest from "@vitest/eslint-plugin"
import { compose, type Configs } from "./core.ts"

const configs: Configs = compose({
	name: "@duncan3142/eslint-config/jsdoc",
	files: ["./test/**/*.{test,spec}.ts"],
	extends: [vitest.configs.recommended],
})

export default configs
