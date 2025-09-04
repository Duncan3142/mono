import { Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import type { Repository } from "#duncan3142/git-tools/core/domain"

/**
 * Repository context service
 */
class RepositoryContext extends Context.Tag(TagFactory.make(`context`, `repository`))<
	RepositoryContext,
	Repository.Repository
>() {}

export { RepositoryContext }
