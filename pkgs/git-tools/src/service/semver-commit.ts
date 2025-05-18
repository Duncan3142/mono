import assert from "node:assert"
import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import type { Ref } from "#refs"
import { DEFAULT_REMOTE } from "#consts"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	pkgName: string
	semVerRef: Ref
	remote?: string
}

class SemVerCommitError extends Error {
	public override name = "SemVerCommitError" as const
}

/**
 * Commits the SemVer changes to the SemVer branch.
 * It checks if the HEAD is at the SemVer branch.
 * If the HEAD is not at the SemVer branch, it exits with an error.
 * If the commit fails, it exits with an error.
 * If the commit is successful, it pushes the changes to the remote.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino logger instance
 * @param props - Properties for commit
 * @param props.pkgName - The name of the package
 * @param props.semVerRef - The SemVer branch ref
 * @param props.remote - The remote name
 * @returns - A promise that resolves when the commit is made
 * @throws {SemVerCommitError} - If the commit fails
 */
const semverCommit = async (
	{ $, pino }: Ctx,
	{ pkgName, semVerRef, remote = DEFAULT_REMOTE }: Props
): Promise<void> => {
	pino.info("Committing SemVer changes...")
	const { stdout: headRef } = await $`git rev-parse --abbrev-ref HEAD`
	assert(typeof headRef === "string", "HEAD is not a string")
	if (headRef !== semVerRef.name) {
		pino.error(`HEAD is not on ${semVerRef.name}`)
		throw new SemVerCommitError(`HEAD is not on ${semVerRef.name}`)
	}
	await $`git add .`
	const { exitCode: commitExitCode } = await $`git commit -m "Semver ${pkgName}"`
	const COMMIT_SUCCESS = 0
	if (commitExitCode === COMMIT_SUCCESS) {
		pino.debug(`Pushing ${semVerRef.name} to ${remote}`)
		await $`git push --force-with-lease "${remote}" "${semVerRef.name}"`
		return
	}
	throw new SemVerCommitError("Commit failed")
}

export default semverCommit
