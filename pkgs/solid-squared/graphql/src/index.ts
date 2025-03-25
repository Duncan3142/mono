import { readdir } from "node:fs/promises"
import { dirname } from "node:path"
import { EitherAsync } from "purify-ts/EitherAsync"
import { findUp } from "find-up-simple"

/**
 * Locate GraphQL schema files
 * @returns - GraphQL schema file paths
 */
const schemaFiles = async (): Promise<Array<string>> =>
	EitherAsync<Error, string>(() => {
		const { dirname: cwd } = import.meta
		return findUp("package.json", {
			cwd,
			type: "file",
		}).then((path) => {
			if (typeof path === "undefined") {
				throw new Error("Could not find 'package.json' for GraphQL schema")
			}
			return `${dirname(path)}/graphql`
		})
	})
		.map((dir) =>
			readdir(dir)
				.then((files) =>
					files.filter((file) => file.endsWith(".graphql")).map((file) => `${dir}/${file}`)
				)
				.then((files) => {
					const ZERO = 0
					if (files.length === ZERO) {
						throw new Error("No GraphQL schema files found")
					}
					return files
				})
		)
		.run()
		.then((either) => {
			const res = either.extract()
			if (res instanceof Error) {
				throw res
			}
			return res
		})

export default schemaFiles
