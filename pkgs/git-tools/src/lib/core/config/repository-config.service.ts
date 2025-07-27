import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"

/**
 *	Configuration service for Git tools
 */
class RepositoryConfig extends Context.Tag(`${SERVICE_PREFIX}/repo-config`)<
	RepositoryConfig,
	{
		readonly directory: string
		readonly defaultRemote: Remote
		readonly fetch: {
			maxDepth: number
			defaultDepth: number
			defaultDeepenBy: number
		}
	}
>() {}

export default RepositoryConfig
