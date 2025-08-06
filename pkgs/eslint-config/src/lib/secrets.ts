import noSecrets from "eslint-plugin-no-secrets"
import type { Config } from "./core.ts"

const secrets: Config = {
	name: "@duncan3142/eslint-config/secrets",
	plugins: { "no-secrets": noSecrets },
	rules: {
		"no-secrets/no-secrets": "error",
	},
}

export default secrets
