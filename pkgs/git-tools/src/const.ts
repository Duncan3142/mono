const BASE_10_RADIX = 10
const SERVICE_PREFIX = "@duncan3142/git-tools"

/**
 * Generates a namespaced tag string.
 * @param id - The ID to be included in the tag.
 * @returns A namespaced tag string in the format `@duncan3142/git-tools/<tag>`.
 */
const tag = <Tag extends string>(id: Tag): `${typeof SERVICE_PREFIX}/${Tag}` =>
	`${SERVICE_PREFIX}/${id}`

export { BASE_10_RADIX, tag }
