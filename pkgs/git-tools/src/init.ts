import type { ExecaMethod } from "execa"
import type { Logger } from "pino"
import printRefs from "#refs"
import fetchRefs from "#fetch"
import { DEFAULT_DEPTH, DEFAULT_REMOTE } from "#consts"

interface Ctx {
	$: ExecaMethod
	pino: Logger
}

interface Props {
	actor: string
	workspace: string
	remote?: string
	tags?: Array<string>
	branches?: Array<string>
	depth?: number
}

/**
 * Fetches refs the remote repository.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino instance
 * @param props - Props object
 * @param props.tags - Tags to fetch
 * @param props.branches - Branches to fetch
 * @param props.depth - Depth of the fetch
 * @param props.remote - Remote repository to fetch from
 * @param props.actor
 * @param props.workspace
 * @returns - A promise that resolves when the init is complete
 */
const init = async (
	{ $, pino }: Ctx,
	{
		actor,
		workspace,
		remote = DEFAULT_REMOTE,
		tags = [],
		branches = [],
		depth = DEFAULT_DEPTH,
	}: Props
): Promise<void> => {
	await $`git config --global user.name ${actor}`
	await $`git config --global user.email ${actor}@users.noreply.github.com`
	await $`git config --global --add safe.directory ${workspace}`
	await $`git config --global init.defaultBranch main`

	await $`mkdir -p ${workspace}"`
	return
}

// eslint-disable-next-line no-secrets/no-secrets -- Temporary
const bash = /* bash */ `

branches=()
requiredBranches=()

while (( "$#" )); do
	case $1 in
		-c | --checkout)
			checkoutBranch="$2"
			shift 2
			;;
		-b | --branch)
			branches+=("$2")
			shift 2
			;;
		-B | --required-branch)
			requiredBranches+=("$2")
			shift 2
			;;
		*)
			timber error "Invalid argument: $1"
			exit 1
			;;
	esac
done

mkdir -p "\${GIT_WORKSPACE}"

cd "\${GIT_WORKSPACE}"

timber info "Init repo:"
git init

# authHeaderConfigKey="http.\${GIT_SERVER_URL}/.extraheader"
# authHeaderConfigValue="AUTHORIZATION: basic $(echo -n "x-access-token:\${GHA_TOKEN}" | base64)"

git remote add "\${GIT_REMOTE}" "\${GIT_SERVER_URL}/\${GIT_REPOSITORY}.git"

if timber -l debug; then
	timber debug "Git config:"
	git config --list
fi

git-fetch "$checkoutBranch"
if [[ \${#requiredBranches[@]} -gt 0 ]]; then
	git-fetch "\${requiredBranches[@]}"
fi
if [[ \${#branches[@]} -gt 0 ]]; then
	git-fetch "\${branches[@]}" || true
fi

timber info "Checkout \${checkoutBranch}:"
git checkout --progress "\${checkoutBranch}"

if timber -l debug; then
	timber debug "Refs post checkout"
	git-refs
fi

cd "\${MONO_WORK_DIR}"

if timber -l debug; then

	timber debug "Work dir:"
	pwd

	timber debug "Work dir files:"
	tree -a
fi
`

export { bash }
export default init
