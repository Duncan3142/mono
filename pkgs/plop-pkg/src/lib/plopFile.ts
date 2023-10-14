import type { AddManyActionConfig, NodePlopAPI } from "plop"
import { pkgRoot } from "./root.js"
import { dirname } from "node:path"

export interface Props {
	name?: string
}

export default (plop: NodePlopAPI, props?: Props) => {
	const { name: genName = "pkg" } = props ?? {}
	const TEMPLATES_DIR = "templates"
	const rootDir = pkgRoot(dirname(import.meta.url))
	const baseDir = `${rootDir}/${TEMPLATES_DIR}`
	const pattern = `${baseDir}/**`
	plop.setGenerator(genName, {
		description: "Create a new package",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name",
			},
			{
				type: "input",
				name: "description",
				message: "Description",
			},
		],
		actions: [
			{
				type: "addMany",
				destination: "pkgs/{{ dashCase name }}",
				base: `${baseDir}/`,
				templateFiles: pattern,
			} satisfies Omit<AddManyActionConfig, "path" | "globOptions">,
		],
	})
}
