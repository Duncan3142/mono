import { Context } from "effect"
import * as Const from "#const"
import * as Repo from "#domain/repository"

/**
 * Repository context service
 */
class Repository extends Context.Tag(Const.tag(`context`, `repository`))<
	Repository,
	Repo.Repository
>() {}

export default Repository
