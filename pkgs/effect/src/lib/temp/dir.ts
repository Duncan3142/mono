import { tmpdir } from "node:os"
import { join } from "node:path"
import { mkdtemp, rm } from "node:fs/promises"
import { type Cause, type Scope, Effect } from "effect"

const acquire = (prefix: string) => Effect.tryPromise(() => mkdtemp(join(tmpdir(), prefix)))

const release = (dir: string) =>
	Effect.promise(() => rm(dir, { recursive: true }).catch(console.error))

/**
 * Creates and cleans up a temporary directory.
 * @param prefix - The prefix for the temporary directory name.
 * @returns An effect that creates and cleans up a temporary directory.
 */
const make = (prefix: string): Effect.Effect<string, Cause.UnknownException, Scope.Scope> =>
	Effect.acquireRelease(acquire(prefix), release)

export { make }
