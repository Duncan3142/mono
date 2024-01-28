import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { isString, isNumber } from "#check/base-type.js"
import { isFinite } from "#check/number/finite.js"
import { object, XisObjectAsync } from "#check/object/async.js"
import { lazy } from "#core/lazy/async.js"
import type { NTuple } from "#util/base-type.js"
import type { ExIn, ExIssues, ExOut } from "#core/kernel.js"
import type { Effect } from "#core/book-keeping.js"
import { chain } from "#core/chain/sync.js"
import type { XisPropBase } from "#check//object/core.js"
import type { XisAsync } from "#core/async.js"

const baseProps = [
	[["name", "!"], isString()],
	[["age", "!"], chain([isNumber(), isFinite()])],
] satisfies NTuple<2, XisPropBase>

type BaseSchema = XisObjectAsync<typeof baseProps>

type BaseIn = ExIn<BaseSchema>
interface LazyIn extends BaseIn {
	readonly boss?: BaseIn
}
type BaseIssues = ExIssues<BaseSchema>
type BaseOut = ExOut<BaseSchema>
interface LazyOut extends BaseOut {
	readonly boss?: BaseOut
}

type Check = XisAsync<LazyIn, BaseIssues, LazyOut, typeof Effect.Transform>

const check: Check = object([...baseProps, [["boss", "?"], lazy(() => check)]] satisfies NTuple<
	3,
	XisPropBase
>)

void it("should pass a matching object", async () => {
	const value = { name: "Foo", age: 2, boss: { name: "Bar", age: 3 } }

	const res = await check.exec({
		value,
		locale: "en",
		ctx: {},
		path: [],
	})

	assertRight(res)

	expect(res.extract()).toEqual(value)
})

void it("should fail an invalid object", async () => {
	const value = { name: "Foo", age: 2, boss: { name: "Bar", age: NaN } }

	const res = await check.exec({
		value,
		locale: "en",
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_FINITE",
			message: "NaN at [] is not a finite",
			path: [],
		},
	]

	expect(res.extract()).toEqual(expected)
})
