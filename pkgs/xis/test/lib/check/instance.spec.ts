import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { instance } from "#check/instance.js"

const testUrl = new URL("https://example.com")
void it("should pass a matching instance", () => {
	const res = instance(URL).exec({
		value: testUrl,
		ctx: {},
		locale: null,
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(testUrl)
})

void it("should fail an invalid value", () => {
	const res = instance(Map).exec({
		value: null,
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_INSTANCE_OF",
			message: "Expected an instance of Map",
			expected: "Map",
			path: [],
			received: "null",
		},
	]

	expect(res.extract()).toEqual(expected)
})

void it("should fail instance", () => {
	const res = instance(Map).exec({
		value: new URL("https://test.com"),
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_INSTANCE_OF",
			message: "Expected an instance of Map",
			expected: "Map",
			path: [],
			received: "URL",
		},
	]

	expect(res.extract()).toEqual(expected)
})

void it("should fail instance", () => {
	const res = instance(Map).exec({
		value: "test",
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_INSTANCE_OF",
			message: "Expected an instance of Map",
			expected: "Map",
			path: [],
			received: "String",
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should fail instance", () => {
	const res = instance(Map).exec({
		value: null,
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_INSTANCE_OF",
			message: "Expected an instance of Map",
			expected: "Map",
			path: [],
			received: "null",
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should fail instance", () => {
	const res = instance(Map).exec({
		value: undefined,
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_INSTANCE_OF",
			message: "Expected an instance of Map",
			expected: "Map",
			path: [],
			received: "undefined",
		},
	]

	expect(res.extract()).toEqual(expected)
})
