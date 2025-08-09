import { Context } from "effect"
import { Tag as TagFactory } from "#const"
import { Repository } from "#domain"

/**
 * Repository context service
 */
class Tag extends Context.Tag(TagFactory.make(`context`, `repository`))<
	Tag,
	Repository.Repository
>() {}

export { Tag }
