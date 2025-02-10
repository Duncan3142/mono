<script lang="ts">
	type Event = MouseEvent & {
		currentTarget: EventTarget & HTMLElement
	}

	let hovered = $state(false)
	const onMouseMove = (event: Event) => {
		const element = event.currentTarget
		const chroma = (event.offsetY / element.clientHeight) * 0.4
		const hue = (event.offsetX / element.clientWidth) * 360

		element.style.setProperty("--psychedelic-chroma", `${chroma}`)
		element.style.setProperty("--psychedelic-hue", `${hue}`)
	}
</script>

<div
	class={[
		{ psychedelic: hovered },
		"flex",
		"grow",
		// "self-stretch",
		"rounded",
		"items-center",
		"justify-center",
	]}
	role="presentation"
	onmousemove={(evt) => {
		onMouseMove(evt)
	}}
	onmouseenter={() => {
		hovered = true
	}}
	onmouseleave={() => {
		hovered = false
	}}
>
	Filler
</div>

<style>
	.psychedelic {
		background-color: oklch(50% var(--psychedelic-chroma) var(--psychedelic-hue));
	}
</style>
