import type { NodePlopAPI } from "plop"
import { pkgRoot } from "./root.js"
import { dirname } from "node:path"

export default (plop: NodePlopAPI, genName = "pkg") => {
	const TEMPLATES = "templates"
	const root = pkgRoot(dirname(import.meta.url))
	const base = `${root}/${TEMPLATES}`
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
				base: `${base}/`,
				path: `${base}/**`,
			},
		],
	})
}
