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
		hovered ? "psychedelic" : "plainJane",
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
		animation: 400ms linear 0s forwards 1 running groovy;
	}

	@keyframes groovy {
		0% {
			background-color: inherit;
		}

		100% {
			background-color: oklch(50% var(--psychedelic-chroma) var(--psychedelic-hue));
		}
	}

	.plainJane {
		animation: 400ms linear 0s forwards 1 running bummer;
	}

	@keyframes bummer {
		0% {
			background-color: oklch(50% var(--psychedelic-chroma) var(--psychedelic-hue));
		}

		100% {
			background-color: inherit;
		}
	}
</style>
