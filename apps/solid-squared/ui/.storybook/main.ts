import type { StorybookConfig } from "@storybook/sveltekit"

const config: StorybookConfig = {
	framework: "@storybook/sveltekit",
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|ts|svelte)"],
}

export default config
