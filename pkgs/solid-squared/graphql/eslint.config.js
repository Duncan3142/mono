// @ts-check

import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript from "@duncan3142/eslint-config/typescript"
import ignored from "@duncan3142/eslint-config/ignored"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import core, { compose } from "@duncan3142/eslint-config/core"
import graphql from "@graphql-eslint/eslint-plugin"

/* eslint-disable jsdoc/check-tag-names -- Type required in JS */

/** @import { Config } from '@duncan3142/eslint-config/core' */

/** @type {Config} */
const graphqlParser = {
	languageOptions: {
		parser: graphql.parser,
	},
	plugins: {
		"@graphql-eslint": graphql,
	},
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

const graphqlConfig = compose({
	name: "@duncan3142/graphql",
	files: ["graphql/*.graphql"],
	extends: [
		graphqlParser,
		graphql.configs["flat/schema-recommended"],
		graphql.configs["flat/schema-relay"],
	],
})

const configs = compose(
	core,
	ignored(),
	base,
	comments,
	typescript(),
	promise,
	jsdoc,
	secrets,
	graphqlConfig,
	prettier
)

export default configs
