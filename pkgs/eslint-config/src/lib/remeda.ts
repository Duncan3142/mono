import remeda from "eslint-plugin-remeda"
import { compose, filePatterns, jstsExtensions, type MutableConfig } from "./core.ts"

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- eslint-plugin-remeda types are not correct
const config: MutableConfig = compose({
	name: "@duncan3142/eslint-config/remeda",
	files: filePatterns(...jstsExtensions),
	// @ts-expect-error -- eslint-plugin-remeda types are not correct
	extends: [remeda.configs.recommended],
}) as unknown as MutableConfig

export default config
