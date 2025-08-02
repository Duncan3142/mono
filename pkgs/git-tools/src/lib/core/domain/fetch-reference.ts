import { Order } from "effect"

import type { Reference } from "./reference.ts"

const Found = true
type Found = typeof Found

const NotFound = false
type NotFound = typeof NotFound

type WasFound = Found | NotFound

interface FetchReference extends Reference {
	optional?: boolean
}

const FETCH_MODE_DEPTH = "depth"
const FETCH_MODE_DEEPEN_BY = "deepen-by"

type FetchMode = typeof FETCH_MODE_DEPTH | typeof FETCH_MODE_DEEPEN_BY

interface FetchModeInput {
	mode: FetchMode
	value: number
}

/**
 * Fetch reference is optional
 * @param reference - Reference to check
 * @returns true if the reference is optional
 */
const isOptional = (reference: FetchReference): boolean => reference.optional ?? false

const OPTIONAL = "optional" as const
type Optional = typeof OPTIONAL

const REQUIRED = "required" as const
type Required = typeof REQUIRED

// type Optionality = Optional | Required

const OPTIONALITY_ORDER_MAP = {
	required: 0,
	optional: 1,
} as const

/**
 * Returns a string representation of the optionality of a fetch reference
 * @param reference - Reference to check
 * @returns "optional" if the reference is optional, "required" otherwise
 */
const optionalString = (reference: FetchReference): Optional | Required =>
	isOptional(reference) ? OPTIONAL : REQUIRED

/**
 * Fetch reference order by optionality
 * @param reference - Reference to check
 * @returns FetchReference order
 */
const sortByOptionality: Order.Order<FetchReference> = Order.mapInput(
	Order.boolean,
	(reference) => isOptional(reference)
)

export type { WasFound, FetchReference, Optional, Required, FetchModeInput }
export {
	Found,
	NotFound,
	sortByOptionality,
	isOptional,
	optionalString,
	OPTIONAL,
	REQUIRED,
	OPTIONALITY_ORDER_MAP,
	FETCH_MODE_DEPTH,
	FETCH_MODE_DEEPEN_BY,
}
