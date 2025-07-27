import { Context } from "effect"
import type PrintRefs from "#case/print-refs.service"
import type Fetch from "#case/fetch.service"
import { SERVICE_PREFIX } from "#const"

/**
 * Git service
 */
class Git extends Context.Tag(`${SERVICE_PREFIX}/git`)<
	Git,
	{
		readonly printRefs: Context.Tag.Service<PrintRefs>
		readonly fetch: Context.Tag.Service<Fetch>
	}
>() {}

export default Git
