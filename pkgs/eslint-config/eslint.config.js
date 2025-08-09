import * as Base from "#lib/base"
import * as JsDoc from "#lib/jsdoc"
import * as Secrets from "#lib/secrets"
import * as Promise from "#lib/promise"
import * as TypeScript from "#lib/typescript"
import * as Ignored from "#lib/ignored"
import * as ImportX from "#lib/import-x"
import * as Prettier from "#lib/prettier"
import * as Comments from "#lib/comments"
import * as Core from "#lib/core"
import * as Arrow from "#lib/arrow-functions"
import * as Vitest from "#lib/vitest"
import * as Context from "#context"

const { when } = Context.factory()

const configs = Core.compose(
	Core.config,
	Ignored.config(),
	Base.config,
	Comments.config,
	TypeScript.config(when),
	ImportX.config(when),
	Promise.config,
	Arrow.config,
	JsDoc.config,
	Secrets.config,
	Vitest.config,
	Prettier.config
)

// eslint-disable-next-line import-x/no-default-export -- ESLint config
export default configs
