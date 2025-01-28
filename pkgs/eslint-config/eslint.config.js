import boundaries from "#boundaries"
import base from "#base"
import jsdoc from "#jsdoc"
import secrets from "#secrets"
import promise from "#promise"
import typescript, { untyped } from "#typescript"
import { ignored } from "#ignored"
import prettier from "#prettier"
import comments from "#comments"
import core, { compose } from "#core"

// const boundaryOptions = {
// settings: {
// 	elements: [
// 		{ type: "cnfg", pattern: [".*.js", "*.config.js"], mode: ElementMode.Full },
// 		{ type: "src", pattern: ["src/*"], mode: ElementMode.Full },
// 	],
// },
// rules: {
// 	elements: [
// 		{
// 			from: ["cnfg"],
// 			allow: ["src"],
// 		},
// 		{
// 			from: ["src"],
// 			allow: ["src"],
// 		},
// 	],
// 	entry: [
// 		{
// 			target: ["src"],
// 			allow: ["*"],
// 		},
// 	],
// 	external: [
// 		{ from: ["*"], allow: ["node:*"] },
// 		{
// 			from: ["cnfg"],
// 			allow: ["@duncan3142/prettier-config"],
// 		},
// 		{
// 			from: ["src"],
// 			allow: [
// 				"eslint",
// 				"@eslint/*",
// 				"eslint-config-*",
// 				"eslint-plugin-*",
// 				"typescript-eslint",
// 				"@typescript-eslint/*",
// 				"@eslint-community/*",
// 			],
// 		},
// 	],
// },
// 	tsConfigs: defaultOptions.tsConfigs,
// }

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	untyped(),
	boundaries(),
	promise,
	jsdoc,
	secrets,
	prettier
)

export default configs
