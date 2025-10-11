import { type Array, type Duration, Effect, pipe } from "effect"
import { LogEffect } from "@duncan3142/effect"
import { FetchExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { TagFactory } from "#duncan3142/git-tools/internal"
import {
	type Remote,
	type FetchError,
	type Reference,
	type GitCommandError,
	FetchMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { FetchDepth } from "#duncan3142/git-tools/lib/core/state"
import { RepositoryConfig } from "#duncan3142/git-tools/lib/core/config"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/lib/core/telemetry"

interface Arguments {
	readonly refs: Array.NonEmptyReadonlyArray<Reference.Reference>
	readonly mode?: FetchMode.FetchMode
	readonly remote?: Remote.Remote
	readonly timeout?: Duration.DurationInput
}

/**
 * Git fetch service
 */
class FetchCommand extends Effect.Service<FetchCommand>()(TagFactory.make(`command`, `fetch`), {
	effect: Effect.gen(function* () {
		const [
			executor,
			{
				defaultRemote,
				fetch: { defaultDepth },
			},
			{ directory },
		] = yield* Effect.all(
			[
				FetchExecutor.FetchExecutor,
				RepositoryConfig.RepositoryConfig,
				RepositoryContext.RepositoryContext,
			],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args: Arguments
		) => Effect.Effect<
			void,
			| FetchError.FetchDepthExceeded
			| FetchError.FetchRefsNotFound
			| GitCommandError.GitCommandFailed
			| GitCommandError.GitCommandTimeout,
			FetchDepth.FetchDepth
		> = ({
			refs,
			remote = defaultRemote,
			mode = FetchMode.Depth({ depth: defaultDepth }),
			timeout = "4 seconds",
		}) =>
			Effect.gen(function* () {
				const fetchDepth = yield* FetchDepth.FetchDepth
				yield* FetchMode.$match(mode, {
					Depth: ({ depth }) => fetchDepth.set(depth),
					DeepenBy: ({ deepenBy }) => fetchDepth.inc(deepenBy),
				})

				return yield* executor({
					mode,
					remote,
					refs,
					directory,
					timeout,
				}).pipe(ExecutorTimer.duration({ tags: { "executor.name": "git.fetch" } }))
			}).pipe(Effect.withSpan("git.fetch", {}))

		return pipe(handler, LogEffect.wrap({ message: "Git fetch" }))
	}),
}) {}

const { Default } = FetchCommand

export { FetchCommand, Default }
export type { Arguments }
