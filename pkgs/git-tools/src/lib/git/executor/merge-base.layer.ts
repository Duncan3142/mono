import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { MergeBaseExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, type Reference, MergeBaseError  } from "#duncan3142/git-tools/domain";

const MERGE_BASE_NOT_FOUND_CODE = 1

const Live: Layer.Layer<MergeBaseExecutor.Tag, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		MergeBaseExecutor.Tag,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				baseRef: { name: baseRef },
				headRef: { name: headRef },
				directory,
				timeout,
			}: MergeBaseExecutor.Arguments): Effect.Effect<
				Reference.SHA,
				MergeBaseError.NotFound | GitCommandError.Failed | GitCommandError.Timeout
			> => Base.make({
					directory,
					subCommand: "merge-base",
					subArgs: [baseRef, headRef],
					timeout,
					errorMatcher: (errorCode: Base.ErrorCode) =>
						pipe(
							Match.value(errorCode),
							Match.when(MERGE_BASE_NOT_FOUND_CODE, () =>
								Effect.fail(
									new MergeBaseError.NotFound({
										baseRef,
										headRef,
									})
								)
							)
						),
				}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
		})
	)

export { Live }
