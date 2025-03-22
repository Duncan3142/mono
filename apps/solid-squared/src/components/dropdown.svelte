<script lang="ts">
	interface Item {
		id: string
		value: string
	}
	interface $Props {
		items: Array<Item>
	}
	const { items }: $Props = $props()
	let popover: HTMLElement | null = null
</script>

<button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1"> Button </button>
<ul
	bind:this={popover}
	class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
	popover
	id="popover-1"
	style="position-anchor:--anchor-1"
>
	{#each items as { id, value } (id)}
		<li data-id={id}>
			<button
				class="btn"
				onclick={() => {
					console.log("clicked", id)
					popover?.hidePopover()
				}}
			>
				{value}
			</button>
		</li>
	{/each}
</ul>
