import { type Duration, Effect, pipe } from "effect"
import { type CommandError, LogSpan } from "@duncan3142/effect"
import type { Reference } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { RevParseExecutor } from "#duncan3142/git-tools/core/executor"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly ref: Reference.Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class RevParseCommand extends Effect.Service<RevParseCommand>()(
	TagFactory.make(`command`, `rev-parse`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[RevParseExecutor.RevParseExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				Reference.SHA,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> = ({ ref, timeout = "2 seconds" }) =>
				executor({ ref, directory, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.rev-parse" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git rev-parse" }, span: { name: "git.rev-parse" } })
			)
		}),
	}
) {}

const { Default } = RevParseCommand

export { RevParseCommand, Default }
export type { Arguments }
