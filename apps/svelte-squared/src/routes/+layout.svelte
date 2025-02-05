<script lang="ts">
	import "../app.css"
	import { ParaglideJS } from "@inlang/paraglide-sveltekit"
	import { i18n } from "$lib/i18n"
	import Header from "$lib/header.svelte"

	let { children } = $props()
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
</ParaglideJS>
