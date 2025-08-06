import { CommandExecutor } from "@effect/platform"
import type { Array } from "effect"
import { Layer, pipe, Effect, Match, Console } from "effect"
import commandFactory from "./base.ts"
import { BRANCH, TAG } from "#domain/reference"
import PrintRefsExecutor, { type Arguments } from "#executor/print-refs.service"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

const PrintRefsExecutorLive: Layer.Layer<
	PrintRefsExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	PrintRefsExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			type,
			directory,
			timeout,
		}: Arguments): Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError> =>
			Effect.gen(function* () {
				const args = pipe(
					Match.value(type),
					Match.when(
						BRANCH,
						(): Array.NonEmptyReadonlyArray<string> => ["branch", "-a", "-v", "-v"]
					),
					Match.when(TAG, (): Array.NonEmptyReadonlyArray<string> => ["tag"]),
					Match.exhaustive
				)
				const [subCommand, ...subArgs] = args

				return yield* pipe(
					commandFactory({
						directory,
						noPager: true,
						subCommand,
						subArgs,
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default PrintRefsExecutorLive
