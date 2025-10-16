/* eslint-disable @typescript-eslint/unbound-method -- Test*/
import { describe, it, expect, vitest } from "@effect/vitest"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Effect, Match, Stream, Console, Data, pipe, Chunk, Exit } from "effect"
import { Command } from "#duncan3142/effect/lib/process"
import { TagFactory } from "#duncan3142/effect/internal"
import { MockConsole } from "#duncan3142/effect/lib/mock"

const STAT_ERROR_TAG = TagFactory.make("test-error", `STAT_ERROR`)

class StatError extends Data.TaggedError(STAT_ERROR_TAG)<{
	exitCode: number
	command: string
	args: ReadonlyArray<string>
}> {}

const STAT_ERROR_CODE = 1

const console = MockConsole.make()

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
	it.scopedLive("should execute commands", () =>
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem
			const path = yield* Path.Path
			const tmpDir = yield* fs.makeTempDirectoryScoped({ prefix: "effect-process-test-" })
			const fileName = "test.txt"
			const filePath = path.join(tmpDir, fileName)
			yield* fs.writeFileString(filePath, "Hello, World!", {
				flag: "wx+",
			})

			const outRes = yield* stat(tmpDir, fileName)

			expect(outRes).toBe("test.txt 13")
			expect(console.log).toHaveBeenNthCalledWith(1, "test.txt 13")
			expect(console.error).not.toHaveBeenCalled()

			vitest.clearAllMocks()

			const errRes = yield* stat(tmpDir, "phantom.txt").pipe(Effect.exit)

			expect(errRes).toEqual(
				Exit.fail(
					new StatError({
						exitCode: STAT_ERROR_CODE,
						command: "stat",
						args: ["-c", "%n %s", "phantom.txt"],
					})
				)
			)
			expect(console.log).not.toHaveBeenCalled()
			expect(console.error).toHaveBeenNthCalledWith(
				1,
				"stat: cannot statx 'phantom.txt': No such file or directory"
			)
		}).pipe(Effect.provide(NodeContext.layer), Effect.withConsole(console))
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Test*/
