import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import { CommandErrorMatcher, type CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { TagExecutor } from "#duncan3142/git-tools/core/executor"
import { TagMode } from "#duncan3142/git-tools/core/domain"

const Live: Layer.Layer<TagExecutor.TagExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		TagExecutor.TagExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				directory,
				timeout,
			}: TagExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const args = TagMode.$match(mode, {
					Create: ({ name, message }) => [name, "-m", message],
					Print: () => [],
				})
				return Base.make({
					directory,
					command: "tag",
					args,
					timeout,
					errorMatcher: CommandErrorMatcher.noOp,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
