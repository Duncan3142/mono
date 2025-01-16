import config from '@duncan3142/prettier-config';

export default {
	...config,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};
