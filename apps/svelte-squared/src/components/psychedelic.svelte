<script lang="ts">
	import Button from "./button.svelte"
	type Event = MouseEvent & {
		currentTarget: EventTarget & HTMLElement
	}

	let hovered = $state(false)
	let groovyElement: HTMLElement | null = null
	const onMouseMove = (event: Event) => {
		if (groovyElement === null) {
			return
		}

		const {
			left: groovyLeft,
			top: groovyTop,
			height: groovyHeight,
			width: groovyWidth,
		} = groovyElement.getBoundingClientRect()

		const groovyOffsetX = event.clientX - groovyLeft
		const groovyOffsetY = event.clientY - groovyTop

		const chroma = (groovyOffsetY / groovyHeight) * 0.4
		const hue = (groovyOffsetX / groovyWidth) * 360

		groovyElement.style.setProperty("--psychedelic-chroma", chroma.toString(10))
		groovyElement.style.setProperty("--psychedelic-hue", hue.toString(10))
	}
</script>

<div
	bind:this={groovyElement}
	class={[
		{ psychedelic: hovered },
		"flex",
		"grow",
		"rounded",
		"items-center",
		"justify-center",
	]}
	role="presentation"
	onmousemovecapture={(evt: Event) => {
		onMouseMove(evt)
	}}
	onmouseenter={() => {
		hovered = true
	}}
	onmouseleave={() => {
		hovered = false
	}}
>
	<Button>Click Me!!!</Button>
</div>

<style>
	.psychedelic {
		background-color: oklch(50% var(--psychedelic-chroma) var(--psychedelic-hue));
	}
</style>
