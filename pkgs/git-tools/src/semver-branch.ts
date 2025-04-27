import assert from "node:assert"
import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import printRefs, { type Ref } from "#refs"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	eventRef: Ref
	semVerRef: Ref
}

class SemVerBranchError extends Error {
	public override name = "SemVerBranchError" as const
}

/**
 * Checks out the SemVer branch.
 * If the branch already exists, it resets it to the base branch.
 * If the branch does not exist, it creates it from the base branch.
 * If the HEAD is not at the base branch, it exits with an error.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino logger instance
 * @param props - Properties for checkout
 * @param props.eventRef - The triggering event ref
 * @param props.semVerRef - The SemVer branch ref
 * @returns - A promise that resolves when the branch is checked out
 * @throws {SemVerBranchError} - If the HEAD is not at the base branch
 */
const semverBranch = async (
	{ $, pino }: Ctx,
	{ semVerRef, eventRef }: Props
): Promise<void> => {
	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre checkout:")
		await printRefs({ $ })
	}
	pino.info("Checkout SemVer branch...")

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre checkout:")
		await printRefs({ $ })
	}

	// Check if the SemVer branch already exists
	const { exitCode: checkoutExitCode } = await $`git checkout --progress "${semVerRef.name}"`
	const CHECKOUT_SUCCESS = 0
	if (checkoutExitCode === CHECKOUT_SUCCESS) {
		if (pino.isLevelEnabled("debug")) {
			pino.debug(`Resetting ${semVerRef.name} to ${eventRef.name}`)
		}
		await $`git reset --hard "${eventRef.name}"`
	} else {
		// Check if the HEAD is at the event ref
		const { stdout: headSha } = await $`git rev-parse HEAD`
		const { stdout: baseSha } = await $`git rev-parse "${eventRef.name}"`

		assert(typeof headSha === "string", "HEAD sha is not a string")
		assert(typeof baseSha === "string", "Base sha is not a string")

		if (headSha !== baseSha) {
			pino.error(`HEAD is not at ${eventRef.name}`)
			pino.debug(`HEAD: ${headSha}`)
			pino.debug(`${eventRef.name}: ${baseSha}`)
			throw new SemVerBranchError("HEAD is not at event ref")
		}

		// Create semver branch from base
		pino.debug(`Creating ${semVerRef.name} from ${eventRef.name}`)
		await $`git checkout --progress -b "${semVerRef.name}"`
	}
	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs post checkout:")
		await printRefs({ $ })
	}
}

export default semverBranch
export type { Ctx, Props }
