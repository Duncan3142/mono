import { type Duration, Effect, pipe } from "effect"
import { LogEffect } from "@duncan3142/effect"
import type { Reference, GitCommandError } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { RevParseExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

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
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> = ({ ref, timeout = "2 seconds" }) =>
				executor({ ref, directory, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.rev-parse" } }),
					Effect.withSpan("git.rev-parse")
				)

			return pipe(handler, LogEffect.wrap({ message: "Git rev-parse" }))
		}),
	}
) {}

const { Default } = RevParseCommand

export { RevParseCommand, Default }
export type { Arguments }
