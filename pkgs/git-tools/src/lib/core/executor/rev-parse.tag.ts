import { type Duration, type Effect, Context } from "effect"
import type { Reference, GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RevParseExecutor extends Context.Tag(TagFactory.make(`executor`, `rev-parse`))<
	RevParseExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		string,
		GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
	>
>() {}

export { RevParseExecutor }
export type { Arguments }
