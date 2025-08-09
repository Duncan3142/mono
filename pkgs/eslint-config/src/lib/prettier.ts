import prettier from "eslint-config-prettier"
import { compose, type Configs } from "./core.ts"

const config: Configs = compose(prettier, {
	rules: {
		curly: "error",
	},
})

export { config }
