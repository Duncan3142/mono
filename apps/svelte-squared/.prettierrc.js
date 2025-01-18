import base from "@duncan3142/prettier-config"

const config = {
	...base,
	plugins: ["prettier-plugin-svelte"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
	],
}

export default config
