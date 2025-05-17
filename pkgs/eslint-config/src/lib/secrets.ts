import noSecrets from "eslint-plugin-no-secrets"
import type { MutableConfig } from "./core.ts"

const secrets: MutableConfig = {
	name: "@duncan3142/eslint-config/secrets",
	plugins: { "no-secrets": noSecrets },
	rules: {
		"no-secrets/no-secrets": "error",
	},
}

export default secrets
