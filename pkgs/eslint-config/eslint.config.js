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
	Core,
	Arrow,
	Vitest,
} from "#duncan3142/eslint-config/lib"

import { Context } from "#duncan3142/eslint-config/context"

const { when } = Context.make()

const configs = Core.compose(
	Core.config,
	Ignored.config(),
	Base.config,
	Comments.config,
	TypeScript.config(when),
	ImportX.config(when),
	Promise.config,
	Arrow.config,
	JSDoc.config,
	Secrets.config,
	Vitest.config,
	Prettier.config
)

// eslint-disable-next-line import-x/no-default-export -- ESLint config
export default configs
