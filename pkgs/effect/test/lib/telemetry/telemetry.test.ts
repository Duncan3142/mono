import { describe, it, expect } from "@effect/vitest"
import { Duration, Effect, Exit, Fiber, Logger, LogLevel, pipe, TestClock } from "effect"
import { MockConsole, MockOtel } from "#duncan3142/effect/lib/mock"
import { DurationTimer, LogEffect } from "#duncan3142/effect/lib/telemetry"

const mockConsole = MockConsole.make()

describe("Telemetry", () => {
	it.effect("should emit telemetry", () =>
		Effect.gen(function* () {
			const {
				layer: OtelLayer,
				logs,
				metrics,
				spans,
			} = MockOtel.make({ serviceName: "test_service" })

			const duration = DurationTimer.make({
				name: "test_timer",
				boundaries: [0, 10, 20, 30],
				description: "A test timer",
				tags: { timer_core_key: "timer_core_value" },
			})

			const timed = () =>
				pipe(
					Effect.sleep(Duration.millis(15)),
					duration({ tags: { timer_use_key: "timer_use_value" } })
				)

			const wrapped = pipe(
				timed,
				LogEffect.wrap({ message: "Test log", annotations: { log_key: "log_value" } })
			)

			const program = pipe(
				wrapped(),
				Effect.andThen(Effect.sleep("1 seconds")),
				Effect.withSpan("test_span", {
					root: true,
					kind: "internal",
					attributes: { span_key: "span_value" },
				})
			)

			const fiber = yield* Effect.fork(
				pipe(
					program,
					Logger.withMinimumLogLevel(LogLevel.Debug),
					Effect.withConsole(mockConsole),
					Effect.provide(OtelLayer),
					Effect.exit
				)
			)

			yield* TestClock.adjust("2 seconds")

			const result = yield* Fiber.join(fiber)

			expect(result).toEqual(Exit.void)
			expect(logs.getLogs()).toEqual([
				expect.objectContaining({
					_body: '{\n  "message": "Test log",\n  "args": []\n}',
					_isReadonly: true,
					_logRecordLimits: {
						attributeCountLimit: 128,
						attributeValueLengthLimit: Infinity,
					},
					_severityNumber: 10000,
					_severityText: "DEBUG",
					attributes: {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
						fiberId: expect.stringMatching(/^#[0-9]+$/),
						log_key: "log_value",
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
						spanId: expect.any(String),
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
						traceId: expect.any(String),
					},
					hrTime: [expect.any(Number), expect.any(Number)],
					hrTimeObserved: [expect.any(Number), expect.any(Number)],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					instrumentationScope: expect.objectContaining({
						name: "@effect/opentelemetry",
					}),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					resource: expect.objectContaining({
						_asyncAttributesPending: false,
						_memoizedAttributes: {
							"service.name": "test_service",
							"telemetry.sdk.language": "nodejs",
							"telemetry.sdk.name": "@effect/opentelemetry",
						},
						_rawAttributes: [
							["service.name", "test_service"],
							["telemetry.sdk.name", "@effect/opentelemetry"],
							["telemetry.sdk.language", "nodejs"],
						],
					}),
					totalAttributesCount: 4,
				}),
			])
			expect(spans.getSpans()).toEqual([
				expect.objectContaining({
					_attributeValueLengthLimit: Infinity,
					_droppedAttributesCount: 0,
					_droppedEventsCount: 0,
					_droppedLinksCount: 0,
					_duration: [expect.any(Number), expect.any(Number)],
					_ended: true,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					_performanceOffset: expect.any(Number),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					_performanceStartTime: expect.any(Number),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					_spanContext: expect.objectContaining({
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
						spanId: expect.any(String),
						traceFlags: 1,
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
						traceId: expect.any(String),
					}),
					_spanLimits: {
						attributeCountLimit: 128,
						attributePerEventCountLimit: 128,
						attributePerLinkCountLimit: 128,
						attributeValueLengthLimit: Infinity,
						eventCountLimit: 128,
						linkCountLimit: 128,
					},
					_startTimeProvided: true,
					attributes: {
						span_key: "span_value",
					},
					endTime: [expect.any(Number), expect.any(Number)],
					events: [
						{
							attributes: {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
								"effect.fiberId": expect.stringMatching(/^#[0-9]+$/),
								"effect.logLevel": "DEBUG",
								log_key: "log_value",
							},
							droppedAttributesCount: 0,
							name: '{\n  "message": "Test log",\n  "args": []\n}',
							time: [expect.any(Number), expect.any(Number)],
						},
					],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					instrumentationScope: expect.objectContaining({
						name: "test_service",
					}),
					kind: 0,
					links: [],
					name: "test_span",
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
					resource: expect.objectContaining({
						_asyncAttributesPending: false,
						_memoizedAttributes: {
							"service.name": "test_service",
							"telemetry.sdk.language": "nodejs",
							"telemetry.sdk.name": "@effect/opentelemetry",
						},
						_rawAttributes: [
							["service.name", "test_service"],
							["telemetry.sdk.name", "@effect/opentelemetry"],
							["telemetry.sdk.language", "nodejs"],
						],
					}),
					startTime: [expect.any(Number), expect.any(Number)],
					status: {
						code: 1,
					},
				}),
			])
			expect(metrics.getMetrics()).toEqual([
				expect.objectContaining({
					scopeMetrics: [
						{
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Expect assertion
							metrics: expect.arrayContaining([
								expect.objectContaining({
									aggregationTemporality: 1,
									dataPointType: 0,
									dataPoints: [
										{
											attributes: {
												time_unit: "milliseconds",
												timer_core_key: "timer_core_value",
												timer_use_key: "timer_use_value",
											},
											endTime: [expect.any(Number), expect.any(Number)],
											startTime: [expect.any(Number), expect.any(Number)],
											value: {
												buckets: {
													boundaries: [0, 10, 20, 30],
													counts: [0, 0, 1, 0, 0],
												},
												count: 1,
												max: 15,
												min: 15,
												sum: 15,
											},
										},
									],
									descriptor: {
										advice: {},
										description: "A test timer",
										name: "test_timer",
										type: "HISTOGRAM",
										unit: "milliseconds",
										valueType: 1,
									},
								}),
							]),
							scope: {
								name: "@effect/opentelemetry/Metrics",
							},
						},
					],
				}),
			])
		})
	)
})
