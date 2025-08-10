import { tmpdir } from "node:os"
import { join } from "node:path"
import { mkdtemp, rm } from "node:fs/promises"
import { Effect } from "effect"

/**
 * Creates a temporary directory for a Git repository.
 * @returns A promise that resolves to the path of the created directory.
 */
const acquire = Effect.tryPromise(() => mkdtemp(join(tmpdir(), "test-repo-")))

const release = (dir: string) =>
	Effect.promise(() => rm(dir, { recursive: true }).catch(console.error))

const make = Effect.acquireRelease(acquire, release)

export { make }
