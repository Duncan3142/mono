import { Context } from "effect"
import * as Const from "#const"
import * as Repo from "#domain/repository"

/**
 * Repository context service
 */
class Tag extends Context.Tag(Const.tag(`context`, `repository`))<Tag, Repo.Repository>() {}

export { Tag}
