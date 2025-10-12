import { readdir } from "node:fs/promises"
import { dirname } from "node:path"
import { EitherAsync } from "purify-ts/EitherAsync"
import { findUp } from "find-up-simple"
import type { Either } from "purify-ts/Either"
import { Left, Right } from "purify-ts/Either"

/**
 * Locate GraphQL schema files
 * @returns - GraphQL schema file paths
 */
const schemaFiles = async (): Promise<Either<Error, Array<string>>> => {
	const filesEither = await EitherAsync<Error, string>(async () => {
		const { dirname: cwd } = import.meta
		const path = await findUp("package.json", {
			cwd,
			type: "file",
		})

		if (typeof path === "undefined") {
			throw new Error("Could not find 'package.json' for GraphQL schema")
		}
		return `${dirname(path)}/graphql`
	})
		.chain(async (dir) => {
			try {
				const files = await readdir(dir)
				return Right({ files, dir })
			} catch (error) {
				if (error instanceof Error) {
					return Left(error)
				}
				return Left(new Error("Could not read GraphQL schema directory"))
			}
		})

		.map(({ dir, files }) =>
			files.filter((file) => file.endsWith(".graphql")).map((file) => `${dir}/${file}`)
		)

		.run()
	return filesEither.chain((files) => {
		const ZERO = 0
		if (files.length === ZERO) {
			return Left(new Error("No GraphQL schema files found"))
		}
		return Right(files)
	})
}

export default schemaFiles
