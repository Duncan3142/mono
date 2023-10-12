import type { NodePlopAPI } from "plop"
import hello from "#templates/src/lib/hello.ts.hbs.js"
import helloSpec from "#templates/test/lib/hello.spec.ts.hbs.js"
import eslintrc from "#templates/.eslintrc.cjs.hbs.js"
import prettierIgnore from "#templates/.prettierignore.hbs.js"
import prettierrc from "#templates/.prettierrc.json.hbs.js"
import LICENSE from "#templates/LICENSE.txt.hbs.js"
import packageJson from "#templates/package.json.hbs.js"
import README from "#templates/README.md.hbs.js"
import tsconfig from "#templates/tsconfig.json.hbs.js"
import tsconfigBase from "#templates/tsconfig.base.json.hbs.js"
import tsconfigBuild from "#templates/tsconfig.build.json.hbs.js"
import tsconfigConfig from "#templates/tsconfig.config.json.hbs.js"
import tsconfigTest from "#templates/tsconfig.test.json.hbs.js"
import turboJson from "#templates/turbo.json.hbs.js"

export default (plop: NodePlopAPI) => {
	plop.setGenerator("pkg", {
		description: "Create a new library",
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
				type: "add",
				path: "pkgs/{{name}}/src/lib/hello.ts",
				template: hello,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/test/lib/hello.ts",
				template: helloSpec,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/.eslintrc.cjs",
				template: eslintrc,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/.prettierignore",
				template: prettierIgnore,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/.prettierrc.json",
				template: prettierrc,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/LICENSE.txt",
				template: LICENSE,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/package.json",
				template: packageJson,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/README.md",
				template: README,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/tsconfig.json",
				template: tsconfig,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/tsconfig.base.json",
				template: tsconfigBase,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/tsconfig.build.json",
				template: tsconfigBuild,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/tsconfig.config.json",
				template: tsconfigConfig,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/tsconfig.test.json",
				template: tsconfigTest,
			},
			{
				type: "add",
				path: "pkgs/{{name}}/turbo.json.js",
				template: turboJson,
			},
		],
	})
}
