<script lang="ts">
	import Html from "./html.svelte"
	import { type HtmlNode, TEXT, ELEMENT, VOID_TAG } from "./stream.parser"

	interface Props {
		node: HtmlNode
	}
	let { node }: Props = $props()
</script>

<!-- HtmlNode.svelte -->

{#if node.type === TEXT}
	<!-- Text node -->
	{node.text}
{:else if node.type === VOID_TAG}
	<!-- Void tag node -->
	<svelte:element this={node.tag} {...node.attributes} />
{:else if node.type === ELEMENT}
	<!-- Element node -->
	<svelte:element this={node.tag} {...node.attributes}>
		{#each node.children as child (child.id)}
			<Html node={child} />
		{/each}
	</svelte:element>
{:else}
	<!-- Unknown node -->
	Unknown node type: {JSON.stringify(node)}
{/if}
