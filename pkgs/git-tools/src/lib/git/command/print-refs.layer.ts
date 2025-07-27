import { CommandExecutor } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { pipe } from "effect/Function"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	die as effectDie,
	orDie as effectOrDie,
	gen as effectGen,
	timeoutFail as effectTimeoutFail,
	provideService as effectProvideService,
	all as effectAll,
	scoped as effectScoped,
} from "effect/Effect"
import { log as consoleLog, error as consoleError } from "effect/Console"
import { decodeText, runForEach as streamRunForEach } from "effect/Stream"
import {
	value as matchValue,
	when as matchWhen,
	orElse as matchOrElse,
	exhaustive as matchExhaustive,
} from "effect/Match"
import {
	make as commandMake,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
	start as commandStart,
} from "@effect/platform/Command"
import type { DurationInput } from "effect/Duration"
import type { NonEmptyReadonlyArray } from "effect/Array"
import { BRANCH, TAG } from "#domain/reference"
import { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"
import PrintCommand, { type Arguments } from "#command/print-refs.service"
import RepositoryConfig from "#config/repository-config.service"

const SUCCESS_CODE = 0

const PrintRefsCommandLive: Layer<PrintCommand, never, CommandExecutor | RepositoryConfig> =
	layerEffect(
		PrintCommand,
		effectGen(function* () {
			const executor = yield* CommandExecutor
			const { directory: repoDirectory } = yield* RepositoryConfig

			return ({ type }: Arguments): Effect<void> =>
				effectGen(function* () {
					const args = pipe(
						matchValue(type),
						matchWhen(
							BRANCH,
							(): NonEmptyReadonlyArray<string> => ["branch", "-a", "-v", "-v"]
						),
						matchWhen(TAG, (): NonEmptyReadonlyArray<string> => ["tag"]),
						matchExhaustive
					)
					const [subcommand, ...subArgs] = args
					const timeout: DurationInput = "2 seconds"
					return yield* pipe(
						commandMake("git", "--no-pager", ...args),
						commandWorkDir(repoDirectory),
						commandStdout("pipe"),
						commandStderr("pipe"),
						commandStart,
						effectOrDie,
						effectFlatMap(({ exitCode, stdout, stderr }) => {
							const result = pipe(
								exitCode,
								effectTimeoutFail({
									duration: timeout,
									onTimeout: () =>
										new GitCommandTimeoutError({ timeout, command: subcommand, args: subArgs }),
								}),
								effectOrDie,
								effectFlatMap((code) =>
									pipe(
										matchValue(code),
										matchWhen(SUCCESS_CODE, () => effectVoid),
										matchOrElse((errorCode) =>
											effectDie(
												new GitCommandFailedError({
													exitCode: errorCode,
													command: subcommand,
													args: subArgs,
												})
											)
										)
									)
								)
							)
							return effectAll(
								[
									result,
									pipe(stdout, decodeText(), streamRunForEach(consoleLog), effectOrDie),
									pipe(stderr, decodeText(), streamRunForEach(consoleError), effectOrDie),
								],
								{ concurrency: "unbounded", discard: true }
							)
						}),
						effectScoped,
						effectProvideService(CommandExecutor, executor)
					)
				})
		})
	)

export default PrintRefsCommandLive
