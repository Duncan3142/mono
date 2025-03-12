<script lang="ts">
	import "$/app.css"
	import { ParaglideJS } from "@inlang/paraglide-sveltekit"
	import { i18n } from "$lib/i18n"
	import Header from "$/components/header.svelte"
	import type { Snippet } from "svelte"

	interface $Props {
		children: Snippet
	}

	let { children }: $Props = $props()
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
</ParaglideJS>
