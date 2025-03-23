<script lang="ts">
	import type { Snippet } from "svelte"
	import { USER, type Role } from "$features/chat/service.svelte"

	interface $Props {
		role: Role
		children: Snippet
	}

	const { role, children }: $Props = $props()
</script>

<article
	data-type="message"
	data-role={role}
	class={["m-1", "overflow-hidden", "rounded-lg", role === USER ? "text-left" : "text-right"]}
>
	{@render children()}
</article>
