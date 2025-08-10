import { Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { Repository } from "#duncan3142/git-tools/domain"

/**
 * Repository context service
 */
class Tag extends Context.Tag(TagFactory.make(`context`, `repository`))<
	Tag,
	Repository.Repository
>() {}

export { Tag }
