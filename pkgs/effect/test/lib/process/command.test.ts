import { describe, it, expect } from "@effect/vitest"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Effect, Match, Stream, Console, Data, pipe, Chunk } from "effect"
import { Command } from "#duncan3142/effect/lib/process"
import { TagFactory } from "#duncan3142/effect/internal"

const STAT_ERROR_TAG = TagFactory.make("test-error", `STAT_ERROR`)

class StatError extends Data.TaggedError(STAT_ERROR_TAG)<{
	exitCode: number
	command: string
	args: ReadonlyArray<string>
}> {}

const STAT_ERROR_CODE = 1

const stat = (dir: string, name: string) =>
	Command.make({
		directory: dir,
		command: "stat",
		args: ["-c", "%n %s", name],
		timeout: "1 second",
		errorMatcher: ({ exitCode, command, args }) =>
			pipe(
				Match.value(exitCode),
				Match.when(STAT_ERROR_CODE, () =>
					Effect.fail(
						new StatError({
							exitCode,
							command,
							args,
						})
					)
				)
			),
		stdoutPipe: (stdErr) =>
			stdErr.pipe(Stream.decodeText(), Stream.splitLines, Stream.tap(Console.log)),
		stderrPipe: (stdErr) =>
			stdErr.pipe(Stream.decodeText(), Stream.splitLines, Stream.tap(Console.error)),
	}).pipe(Effect.andThen(Stream.runCollect), Effect.map(Chunk.join("\n")))

describe("Command", () => {
	it.scopedLive("should execute successfully", () =>
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem
			const path = yield* Path.Path
			const tmpDir = yield* fs.makeTempDirectoryScoped({ prefix: "effect-process-test-" })
			const fileName = "test.txt"
			const filePath = path.join(tmpDir, fileName)
			yield* fs.writeFileString(filePath, "Hello, World!", {
				flag: "wx+",
			})

			const result = yield* stat(tmpDir, fileName)

			expect(result).toBe("test.txt 13")
		}).pipe(Effect.provide(NodeContext.layer))
	)
})
