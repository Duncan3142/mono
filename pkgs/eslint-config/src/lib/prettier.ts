import prettier from "eslint-config-prettier"
import { compose, type MutableConfigs } from "./core.ts"

const config: MutableConfigs = compose(prettier, {
	rules: {
		curly: "error",
	},
})

export default config
