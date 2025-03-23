const BRAND = Symbol("brand")

type Brand<B extends symbol> = { [BRAND]: B | undefined }

/**
 * Brand a value
 * @param _ - Brand
 * @param value - Value
 * @returns Branded value
 */
const brand = <const B extends symbol, const T>(_: B, value: T): T & Brand<B> =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Branding
	value as T & Brand<B>

/**
 * @example
 * const URL_BRAND = Symbol("url")
 * const url = (value: string) => brand(URL_BRAND, value)
 */

export default brand
