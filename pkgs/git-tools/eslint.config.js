// @ts-check

import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript from "@duncan3142/eslint-config/typescript"
import ignored from "@duncan3142/eslint-config/ignored"
import importX from "@duncan3142/eslint-config/import-x"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import context from "@duncan3142/eslint-config/context"
import core, { compose } from "@duncan3142/eslint-config/core"
import vitest from "@duncan3142/eslint-config/vitest"

const { when } = context()

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	importX(when),
	promise,
	jsdoc,
	secrets,
	vitest,
	prettier
)

export default configs
