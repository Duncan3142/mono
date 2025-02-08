<script lang="ts">
	import Element from "./element.svelte"
	import { USER, type Role } from "$features/chat/service.svelte"

	interface Props {
		role: Role
		content: string
	}

	const { role, content }: Props = $props()
</script>

<Element {role}>
	<div data-content="text" class={["p-1", role === USER ? "bg-blue-500" : "text-green-500"]}>
		{content}
	</div>
</Element>
