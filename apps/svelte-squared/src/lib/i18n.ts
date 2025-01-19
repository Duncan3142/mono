import { createI18n } from "@inlang/paraglide-sveltekit"
import * as runtime from "$lib/paraglide/runtime"

type I18n = ReturnType<typeof createI18n<"en-gb">>

/**
 * I18n
 */
export const i18n: I18n = createI18n(runtime)
export default i18n
