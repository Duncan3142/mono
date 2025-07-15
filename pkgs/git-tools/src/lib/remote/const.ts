import type { Remote } from "#remote/domain"

const DEFAULT_REMOTE_NAME = "origin"
const DEFAULT_REMOTE: Remote = { name: DEFAULT_REMOTE_NAME }

// eslint-disable-next-line import-x/prefer-default-export -- expect more
export { DEFAULT_REMOTE }
