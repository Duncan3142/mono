<script lang="ts">
	import type { Snippet } from "svelte"

	interface $Props {
		children: Snippet
	}
	const { children }: $Props = $props()
</script>

<button class="btn">{@render children()}</button>
