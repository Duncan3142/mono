import { it } from "node:test"
import { deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { XisString, string } from "#check/string/string.js"
import { XisNumber, number } from "#check/number/number.js"
import { shape } from "#check/shape/sync.js"
import { lazy } from "#core/lazy/sync.js"
import {
	k,
	ko,
	type ShapeDefaultMode,
	type Prop,
	type ShapeIn,
	type ShapeOut,
	type ShapeGuardIssues,
	type ShapeExecIssues,
	type ShapeArgs,
	type K,
} from "#check/shape/core.js"
import type { XisSync } from "#core/sync.js"

type BaseSchema = [Prop<K<"name">, XisString>, Prop<K<"age">, XisNumber>]

type BI = ShapeIn<BaseSchema, ShapeDefaultMode>
interface I extends BI {
	readonly spouse?: I
}
type BO = ShapeOut<BaseSchema, ShapeDefaultMode>
interface O extends BO {
	readonly spouse?: O
}
type GI = ShapeGuardIssues<BaseSchema, ShapeDefaultMode>
type EI = ShapeExecIssues<BaseSchema, ShapeDefaultMode>
type A = ShapeArgs<BaseSchema>

type Check = XisSync<I, GI, EI, O, A>

const check: Check = shape([
	// break
	[k("name"), string],
	// break
	[k("age"), number],
	// break
	[ko("spouse"), lazy(() => check)],
])

void it("should pass a matching object", () => {
	const value = { name: "Foo", age: 2, spouse: { name: "Bar", age: 3 } }

	const res = check.exec(value, {
		args: undefined,
		path: [],
	})

	assertRight(res)

	deepEqual(res.extract(), value)
})

void it("should fail an invalid object", () => {
	const res = check.parse(true, {
		args: undefined,
		path: [],
	})
	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			expected: "object",
			name: "INVALID_TYPE",
			path: [],
			received: "boolean",
		},
	]

	deepEqual(res.extract(), expected)
})
