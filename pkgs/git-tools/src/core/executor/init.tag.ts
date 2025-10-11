import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly directory: string
	readonly bare: boolean
	readonly initBranch: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class InitExecutor extends Context.Tag(TagFactory.make(`executor`, `init`))<
	InitExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { InitExecutor }
export type { Arguments }
