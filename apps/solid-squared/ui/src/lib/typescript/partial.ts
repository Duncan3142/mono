/**
 * Partially apply arguments to a function
 * @param arrow - Arrow function
 * @param captured - Captured arguments
 * @returns Partially applied function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contravariant
const partial = <Captured extends Array<any>, Free extends Array<any>, R>(
	arrow: (this: undefined, ...args: [...Captured, ...Free]) => R,
	...captured: Captured
	// eslint-disable-next-line no-undefined -- Arrow function
): ((...args: Free) => R) => arrow.bind(undefined, ...captured)

/**
 * Bind a function to a context
 * @param bound - Bound context
 * @param func - Function
 * @param captured - Captured arguments
 * @returns Bound function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contravariant
const bind = <This, Captured extends Array<any>, Free extends Array<any>, R>(
	bound: This,
	func: (this: This, ...args: [...Captured, ...Free]) => R,
	...captured: Captured
): ((...args: Free) => R) => func.bind(bound, ...captured)

export { partial, bind }
