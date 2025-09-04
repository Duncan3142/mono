import { type Array, type Duration, Effect } from "effect"
import { FetchExecutor } from "#duncan3142/git-tools/executor"
import { TagFactory } from "#duncan3142/git-tools/const"
import {
	type Remote,
	type FetchError,
	type Reference,
	type GitCommandError,
	FetchMode,
} from "#duncan3142/git-tools/domain"
import { FetchDepth } from "#duncan3142/git-tools/state"
import { RepositoryConfig } from "#duncan3142/git-tools/config"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { ExecutorDuration } from "#duncan3142/git-tools/metric"
import { WrapLog } from "#duncan3142/git-tools/log"

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
		> = WrapLog.wrap(
			"Git fetch",
			({
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
					}).pipe(ExecutorDuration.duration, Effect.withSpan("git-fetch"))
				})
		)
		return handler
	}),
}) {}

const { Default } = FetchCommand

export { FetchCommand, Default }
export type { Arguments }
