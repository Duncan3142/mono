import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { TagExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, TagMode } from "#duncan3142/git-tools/domain"

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
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const [subArgs, noPager] = TagMode.$match(mode, {
					Create: ({ name, message }) => [[name, "-m", message], false] as const,
					Print: () => [[], true] as const,
				})
				return pipe(
					Base.make({
						directory,
						noPager,
						subCommand: "tag",
						subArgs,
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
