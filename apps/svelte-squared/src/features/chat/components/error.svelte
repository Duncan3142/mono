<script lang="ts">
	import Element from "./element.svelte"
	import type { Role } from "$features/chat/service.svelte"

	interface Props {
		role: Role
		error: Error
	}

	const { role, error }: Props = $props()
</script>

<Element {role}>
	<div data-content="error" class={["bg-red-500", "text-amber-500"]}>
		{error.message}
	</div>
</Element>
