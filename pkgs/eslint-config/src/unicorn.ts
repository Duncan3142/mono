import unicorn from "eslint-plugin-unicorn"
import { compose, filePatterns, jstsExtensions, type Config, type Configs } from "./core.ts"

const custom: Config = {
	name: "@duncan3142/eslint-config/unicorn/custom",
	rules: { "unicorn/no-typeof-undefined": "off" },
}

const configs: Configs = compose({
	name: "@duncan3142/eslint-config/unicorn",
	files: filePatterns(...jstsExtensions),
	extends: [unicorn.configs.recommended, custom],
})

export default configs
