import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect, type Cause } from "effect"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"

/**
 * Creates a new file.
 * @param name - The name of the file to create
 * @returns An effect that creates the file
 */
const make = (
	name: string
): Effect.Effect<void, Cause.UnknownException, RepositoryContext.RepositoryContext> =>
	Effect.gen(function* () {
		const { directory } = yield* RepositoryContext.RepositoryContext
		return yield* Effect.tryPromise(() => writeFile(join(directory, name), ""))
	})

export { make }
