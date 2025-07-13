import base from "#lib/base"
import jsdoc from "#lib/jsdoc"
import secrets from "#lib/secrets"
import promise from "#lib/promise"
import typescript from "#lib/typescript"
import ignored from "#lib/ignored"
import importX from "#lib/import-x"
import prettier from "#lib/prettier"
import comments from "#lib/comments"
import core, { compose } from "#lib/core"
import arrow from "#lib/arrow-functions"
import context from "#context"

const { when } = context()

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	importX(when),
	promise,
	arrow,
	jsdoc,
	secrets,
	prettier
)

export default configs
