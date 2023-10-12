export default `{
	"extends": ["//"],
	"pipeline": {
		"format": {
			"outputs": [".prettier/**"],
			"dependsOn": []
		},
		"format:fix": {
			"outputs": [".prettier/**"],
			"dependsOn": []
		},
		"assets": {
			"outputs": [".tsc/**"],
			"dependsOn": ["^assets"]
		},
		"test:eslint": {
			"outputs": [".eslint/**"],
			"dependsOn": ["assets"]
		},
		"test:node": {
			"outputs": [".coverage/**"],
			"dependsOn": ["assets"]
		},
		"test": {
			"outputs": [],
			"dependsOn": ["test:eslint", "test:node"]
		}
	}
}
`
