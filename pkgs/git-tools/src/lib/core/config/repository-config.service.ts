import { Tag } from "effect/Context"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"

/**
 *	Configuration service for Git tools
 */
class RepositoryConfig extends Tag(`${SERVICE_PREFIX}/repo-config`)<
	RepositoryConfig,
	{
		readonly directory: string
		readonly defaultRemote: Remote
	}
>() {}

export default RepositoryConfig
