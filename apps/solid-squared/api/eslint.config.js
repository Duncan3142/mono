// @ts-check

import base from "@duncan3142/eslint-config/base"
import jsdoc from "@duncan3142/eslint-config/jsdoc"
import secrets from "@duncan3142/eslint-config/secrets"
import promise from "@duncan3142/eslint-config/promise"
import typescript from "@duncan3142/eslint-config/typescript"
import ignored from "@duncan3142/eslint-config/ignored"
import prettier from "@duncan3142/eslint-config/prettier"
import comments from "@duncan3142/eslint-config/comments"
import unocss from "@unocss/eslint-config/flat"
import core, { compose } from "@duncan3142/eslint-config/core"
import solid from "eslint-plugin-solid"
import globals from "globals"

/* eslint-disable jsdoc/check-tag-names -- Type required in JS */

/** @import { Config } from '@duncan3142/eslint-config/core' */

/** @type {Config} */
const globalsConfig = {
	name: "@duncan3142/globals",
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: "module",
		globals: { ...globals.node, ...globals.browser },
	},
}

/* eslint-enable jsdoc/check-tag-names -- Type required in JS */

export default compose(
	core,
	ignored(),
	base,
	globalsConfig,
	comments,
	typescript(),
	solid.configs["flat/typescript"],
	promise,
	jsdoc,
	secrets,
	unocss,
	prettier
)
