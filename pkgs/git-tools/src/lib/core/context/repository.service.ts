import { Context } from "effect"
import { tag } from "#const"
import type { Repository as RepositoryData } from "#domain/repository"

/**
 * Repository context service
 */
class Repository extends Context.Tag(tag(`context`, `repository`))<
	Repository,
	RepositoryData
>() {}

export default Repository
