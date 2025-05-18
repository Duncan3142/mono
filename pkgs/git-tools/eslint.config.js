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
// import functional from "@duncan3142/eslint-config/functional"
import unicorn from "@duncan3142/eslint-config/unicorn"
import context from "@duncan3142/eslint-config/context"
import core, { compose } from "@duncan3142/eslint-config/core"

const { when } = context()

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	importX(when),
	// functional,
	unicorn(when),
	promise,
	jsdoc,
	secrets,
	prettier
)

export default configs
