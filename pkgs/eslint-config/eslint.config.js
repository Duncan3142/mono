import base from "#lib/base"
import jsdoc from "#lib/jsdoc"
import secrets from "#lib/secrets"
import promise from "#lib/promise"
import typescript from "#lib/typescript"
import ignored from "#lib/ignored"
import importX from "#lib/import-x"
import prettier from "#lib/prettier"
import comments from "#lib/comments"
import functional from "#lib/functional"
import core, { compose } from "#lib/core"
import context from "#context"

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

const { when } = context()

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	importX(when),
	functional,
	promise,
	jsdoc,
	secrets,
	prettier
)

export default configs
