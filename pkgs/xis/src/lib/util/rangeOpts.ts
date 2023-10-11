import { neverGuard } from "./never-guard.js"

export type LowerBoundOpts<T> =
	| {
			op: "gt"
			bound: T
	  }
	| {
			op: "gte"
			bound: T
	  }

export type UpperBoundOpts<T> =
	| {
			op: "lt"
			bound: T
	  }
	| {
			op: "lte"
			bound: T
	  }

export type RangeOpts<T> =
	| [lower: LowerBoundOpts<T>, upper: UpperBoundOpts<T>]
	| [lower: LowerBoundOpts<T>]
	| [upper: UpperBoundOpts<T>]

export const inRange = <T>(value: T, opts: RangeOpts<T>): boolean => {
	const [firstOpt] = opts

	if (opts.length === 2) {
		const [, secondOpt] = opts
		return (
			(firstOpt.op === "gt" ? value > firstOpt.bound : value >= firstOpt.bound) &&
			(secondOpt.op === "lt" ? value < secondOpt.bound : value <= secondOpt.bound)
		)
	}

	switch (firstOpt.op) {
		case "gt":
			return value > firstOpt.bound
		case "gte":
			return value >= firstOpt.bound
		case "lt":
			return value < firstOpt.bound
		case "lte":
			return value <= firstOpt.bound
		/* c8 ignore start */
		default:
			return neverGuard(firstOpt)
		/* c8 ignore stop */
	}
}
