interface Remote {
	name: string
}
const DEFAULT_REMOTE_NAME = "origin"
const DEFAULT_REMOTE: Remote = { name: DEFAULT_REMOTE_NAME }

export { DEFAULT_REMOTE }
export type { Remote }
