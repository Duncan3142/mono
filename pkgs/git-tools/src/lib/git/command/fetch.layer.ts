import {
	make as commandMake,
	start as commandStart,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	fail as effectFail,
	orDie as effectOrDie,
	die as effectDie,
	timeoutFail as effectTimeoutFail,
	all as effectAll,
	provideService as effectProvideService,
	gen as effectGen,
	scoped as effectScoped,
} from "effect/Effect"
import { decodeText, runForEach as streamRunForEach } from "effect/Stream"
import { pipe } from "effect/Function"
import { value as matchValue, when as matchWhen, orElse as matchOrElse } from "effect/Match"
import { CommandExecutor } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { log as consoleLog, error as consoleError } from "effect/Console"
import type { DurationInput } from "effect/Duration"
import { FetchRefsNotFoundError } from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { toStrings as refSpecToStrings } from "#domain/reference-spec"
import type { Arguments } from "#command/fetch.service"
import FetchCommand from "#command/fetch.service"
import RepositoryConfig from "#config/repository-config.service"
import { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

const FETCH_SUCCESS_CODE = 0
const FETCH_NOT_FOUND_CODE = 128

const FetchCommandLive: Layer<FetchCommand, never, CommandExecutor | RepositoryConfig> =
	layerEffect(
		FetchCommand,
		effectGen(function* () {
			const { defaultRemote, directory: repoDirectory } = yield* RepositoryConfig
			const executor = yield* CommandExecutor

			return ({
				depth,
				deepen,
				remote,
				refs,
			}: Arguments): Effect<void, FetchRefsNotFoundError> =>
				effectGen(function* () {
					const { remote: remoteName, refs: refStrings } = refSpecToStrings({
						remote: remote ?? defaultRemote,
						refs,
					})

					const depthString = depth.toString(BASE_10_RADIX)

					const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

					const subCommand = "fetch"
					const subArgs = [depthArgument, remoteName, ...refStrings]
					const timeout: DurationInput = "8 seconds"

					return yield* pipe(
						commandMake("git", subCommand, ...subArgs),
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
										new GitCommandTimeoutError({
											timeout,
											command: subCommand,
											args: subArgs,
										}),
								}),
								effectOrDie,
								effectFlatMap((code) =>
									pipe(
										matchValue(code),
										matchWhen(FETCH_SUCCESS_CODE, () => effectVoid),
										matchWhen(FETCH_NOT_FOUND_CODE, () =>
											effectFail(
												new FetchRefsNotFoundError({
													references: refStrings,
												})
											)
										),
										matchOrElse((errorCode) =>
											effectDie(
												new GitCommandFailedError({
													exitCode: errorCode,
													command: subCommand,
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

export default FetchCommandLive
