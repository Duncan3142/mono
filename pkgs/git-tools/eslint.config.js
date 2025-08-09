// @ts-check

import * as Base from "@duncan3142/eslint-config/base"
import * as JSDoc from "@duncan3142/eslint-config/jsdoc"
import * as Secrets from "@duncan3142/eslint-config/secrets"
import * as Promise from "@duncan3142/eslint-config/promise"
import * as TypeScript from "@duncan3142/eslint-config/typescript"
import * as Ignored from "@duncan3142/eslint-config/ignored"
import * as ImportX from "@duncan3142/eslint-config/import-x"
import * as Prettier from "@duncan3142/eslint-config/prettier"
import * as Comments from "@duncan3142/eslint-config/comments"
import * as Context from "@duncan3142/eslint-config/context"
import * as Core from "@duncan3142/eslint-config/core"
import * as Vitest from "@duncan3142/eslint-config/vitest"

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
