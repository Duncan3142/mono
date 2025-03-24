import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript from "@duncan3142/eslint-config/typescript"
import ignored from "@duncan3142/eslint-config/ignored"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import core, { compose } from "@duncan3142/eslint-config/core"

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	promise,
	jsdoc,
	secrets,
	prettier
)

export default configs
