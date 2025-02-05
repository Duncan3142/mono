<script lang="ts">
	import { USER, type Role } from "../chat.service.svelte"
	import Element from "./element.svelte"

	interface Props {
		role: Role
		content: string
	}

	const { role, content }: Props = $props()
</script>

<Element {role}>
	<div data-content="text" class={[role === USER ? "bg-blue-500" : "text-green-500"]}>
		{content}
	</div>
</Element>
