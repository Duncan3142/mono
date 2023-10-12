export default `{
	"$schema": "https://json.schemastore.org/tsconfig",
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"outDir": ".tsc",
		"allowJs": true,
		"tsBuildInfoFile": ".tsc/tsconfig.config.tsbuildinfo"
	},
	"include": [".*", "*"]
}
`
