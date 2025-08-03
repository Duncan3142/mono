const RESET_MODE_HARD = "HARD"
const RESET_MODE_MIXED = "MIXED"
const RESET_MODE_SOFT = "SOFT"

type ResetMode = typeof RESET_MODE_HARD | typeof RESET_MODE_MIXED | typeof RESET_MODE_SOFT

export { RESET_MODE_HARD, RESET_MODE_MIXED, RESET_MODE_SOFT }
export type { ResetMode }
