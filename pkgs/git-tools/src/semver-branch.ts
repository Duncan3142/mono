import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import printRefs from "#refs"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	baseRef: Ref
	headRef: Ref
	remote?: string
	maxDepth?: number
	deepenBy?: number
}

/**
 * Checks out the SemVer branch.
 * If the branch already exists, it resets it to the base branch.
 * If the branch does not exist, it creates it from the base branch.
 * If the HEAD is not at the base branch, it exits with an error.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino logger instance
 * @returns - A promise that resolves when the branch is checked out
 * @throws {Error} - If the HEAD is not at the base branch
 */
const semverBranch = async ({ $, pino }: Ctx): Promise<void> => {
	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre checkout:")
		await printRefs({ $ })
	}
	pino.info("Checkout SemVer branch...")

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre checkout:")
		await printRefs({ $ })
	}
}

const bash = /* bash */ `

# Try to fetch remote semver branch
if git checkout --progress "${SEMVER_BRANCH}"; then
	if timber -l debug; then
		timber debug "Resetting ${SEMVER_BRANCH} to ${EVENT_BRANCH}"
	fi
	git reset --hard "${EVENT_BRANCH}"
else
	# Check if the HEAD is at the base branch
	headSha=$(git rev-parse HEAD)
	baseSha=$(git rev-parse "${EVENT_BRANCH}")

	if [[ "${headSha}" != "${baseSha}" ]]; then
		timber error "HEAD is not at ${EVENT_BRANCH}"
		timber debug "HEAD: ${headSha}"
		timber debug "${EVENT_BRANCH}: ${baseSha}"
		exit 1
	fi

	# Create semver branch from base
	timber debug "Creating ${SEMVER_BRANCH} from ${EVENT_BRANCH}"
	git checkout --progress -b "${SEMVER_BRANCH}"
fi

if timber -l debug; then
	timber debug "Refs post checkout:"
	git-refs
fi
`

export default semverBranch
export type { Ctx, Props }
