<script lang="ts">
	import type { Log } from "../service.svelte"
	import Content from "./content.svelte"
	import Error from "./error.svelte"
	import Thinking from "./thinking.svelte"

	interface Props {
		log: Log
		thinking: boolean
	}

	const { log, thinking }: Props = $props()
</script>

<main
	data-type="conversation"
	class={["flex", "flex-[1_1_auto]", "flex-col", "overflow-hidden"]}
>
	{#each log as message (message.timestamp)}
		{#if message.hasContent}
			<Content role={message.role} content={message.content} />
		{:else if message.hasError}
			<Error role={message.role} error={message.error} />
		{/if}
	{/each}
	{#if thinking}
		<Thinking />
	{/if}
</main>
