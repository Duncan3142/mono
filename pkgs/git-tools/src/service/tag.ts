import assert from "node:assert"
import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import { TAG, type Ref } from "#service/refs"
import { DEFAULT_REMOTE } from "#config/consts"
import fetchRefs from "#service/fetch"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	pkgTag: string
	eventRef: Ref
	remote?: string
}

/**
 * Tag Error
 */
class TagError extends Error {
	public override name = "TagError" as const
}

/**
 * Tags the current commit with the given tag.
 * If the tag already exists, it checks if it points to the same commit.
 * If it does not, it exits with an error.
 * If the tag does not exist, it creates it and pushes it to the remote.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino logger instance
 * @param props - Properties object
 * @param props.pkgTag - The package tag
 * @param props.eventRef - The event ref
 * @param props.remote - The remote repository
 * @returns - A promise that resolves when the tag is created
 * @throws {TagError} - If the tag already exists and points to a different commit, the tag creation fails, the tag push fails
 */
const tag = async (
	{ $, pino }: Ctx,
	{ pkgTag, eventRef, remote = DEFAULT_REMOTE }: Props
): Promise<void> => {
	pino.info(`Tagging ${pkgTag}...`)
	const {} = await fetchRefs(
		{ $, logger: pino },
		{ refs: [{ name: pkgTag, type: TAG }], remote }
	)
}

const bash = /* bash */ `

	timber info "Tagging ${pkgTag}..."

	if git-fetch -t "${pkgTag}"; then
		timber warn "Tag ${pkgTag} already exists"
		tagSha=$(git show-ref --hash --tags "${pkgTag}")
		headSha=$(git rev-parse HEAD)
		if [[ "${tagSha}" != "${headSha}" ]]; then
			timber warn "Tag ${pkgTag} (${tagSha}) does not reference ${EVENT_BRANCH} HEAD (${headSha})"
			exit 64
		fi
	else
		git tag "${pkgTag}"
		git push "${GIT_REMOTE}" "${pkgTag}"
	fi
	)
`

export default tag
export { TagError }
