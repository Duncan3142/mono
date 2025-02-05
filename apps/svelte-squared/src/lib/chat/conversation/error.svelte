<script lang="ts">
	import type { Role } from "../chat.service.svelte"
	import Element from "./element.svelte"

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
