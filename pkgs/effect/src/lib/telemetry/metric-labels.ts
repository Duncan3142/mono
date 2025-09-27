import { MetricLabel } from "effect"

type Tags = Readonly<Record<string, string>>

/**
 * Convert a Tags object to an array of MetricLabel.
 * @param tags - The tags to convert.
 * @returns An array of MetricLabel.
 */
const make = (tags: Tags): ReadonlyArray<MetricLabel.MetricLabel> =>
	Object.entries(tags).map(([key, value]) => MetricLabel.make(key, value))

export type { Tags }

export { make }
