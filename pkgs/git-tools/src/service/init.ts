import { resolve } from "node:path"
import type { Logger } from "pino"
import type { ExecaScript } from "#adapter/execa"
import printRefs, { type Ref } from "#service/refs"
import fetchRefs, { type FetchRef } from "#service/fetch"
import { DEFAULT_DEPTH, DEFAULT_REMOTE } from "#config/consts"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	actor: string
	workspace: string
	workdir: string
	remote: string
	repository: {
		name: string
		serverUrl: string
	}
	checkout: Ref
	fetch?: Array<FetchRef>
	depth?: number
}

/**
 * Fetches refs the remote repository.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino instance
 * @param props - Props object
 * @param props.actor - Git actor name
 * @param props.workspace - Workspace directory path
 * @param props.workdir - Working directory path
 * @param props.remote - Remote repository to fetch from
 * @param props.repository - Repository information
 * @param props.repository.name - Repository name
 * @param props.repository.serverUrl - Repository server URL
 * @param props.checkout - Ref to checkout
 * @param props.fetch - Additional refs to fetch
 * @param props.depth - Fetch depth
 * @returns - A promise that resolves when the init is complete
 */
const init = async (
	{ $, pino }: Ctx,
	{
		actor,
		workspace,
		workdir,
		remote = DEFAULT_REMOTE,
		repository: { name: repoName, serverUrl },
		checkout,
		fetch = [],
		depth = DEFAULT_DEPTH,
	}: Props
): Promise<ExecaScript> => {
	pino.info("Set git config:")

	await $`git config --global user.name ${actor}`
	await $`git config --global user.email ${actor}@users.noreply.github.com`
	await $`git config --global --add safe.directory ${workspace}`
	await $`git config --global init.defaultBranch main`

	pino.info("Create workspace dir:")
	await $`mkdir -p ${workspace}"`

	const $$ = $({ cwd: workspace })
	pino.info("Init repo:")
	await $$`git init`

	pino.info("Set remote:")
	await $$`git remote add ${remote} ${serverUrl}/${repoName}.git`

	await fetchRefs({ $: $$, logger: pino }, { remote, refs: [...fetch, checkout], depth })

	pino.info(`Checkout ${checkout.type ?? "branch"} ${checkout.name}`)
	await $$`git checkout --progress ${checkout.name}`

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs post checkout:")
		await printRefs({ $: $$ })
	}

	const workingDir = resolve(workspace, workdir)

	const $$$ = $({ cwd: workingDir })

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Work dir:")
		pino.debug(workingDir)

		pino.debug("Work dir files:")
		await $$$`tree -a`
	}

	return $$$
}

export default init
