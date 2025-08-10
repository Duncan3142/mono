// @ts-check

import {
	Base,
	JSDoc,
	Secrets,
	Promise,
	TypeScript,
	Ignored,
	ImportX,
	Prettier,
	Comments,
	Context,
	Core,
	Vitest,
} from "@duncan3142/eslint-config"

const { when } = Context.factory()

const configs = Core.compose(
	Core.config,
	Ignored.config(),
	Base.config,
	Comments.config,
	TypeScript.config(when),
	ImportX.config(when),
	Promise.config,
	JSDoc.config,
	Secrets.config,
	Vitest.config,
	Prettier.config
)

export default configs
