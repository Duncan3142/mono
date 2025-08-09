import noSecrets from "eslint-plugin-no-secrets"
import type { Config } from "./core.ts"

const config: Config = {
	name: "@duncan3142/eslint-config/secrets",
	plugins: { "no-secrets": noSecrets },
	rules: {
		"no-secrets/no-secrets": "error",
	},
}

export { config }
