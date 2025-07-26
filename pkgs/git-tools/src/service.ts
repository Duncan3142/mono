import { Tag } from "effect/Context"
import type PrintRefs from "#case/print-refs.service"
import type Fetch from "#case/fetch.service"
import { SERVICE_PREFIX } from "#const"

/**
 * Git service
 */
class Git extends Tag(`${SERVICE_PREFIX}/git`)<
	Git,
	{
		readonly printRefs: Tag.Service<PrintRefs>
		readonly fetch: Tag.Service<Fetch>
	}
>() {}

export default Git
