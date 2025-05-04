import core from "./core.ts"
import importX from "./import-x.ts"
import { compose, type Configs } from "#lib/core"

/**
 * TypeScript ESLint config
 * @returns ESLint config
 */
const configs = (): Configs => compose(core(), importX)

export default configs
