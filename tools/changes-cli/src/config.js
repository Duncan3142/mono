import {argv, env} from "node:process"

const args = argv.slice(2)

export const configuration = ({parseLogEnv}) => {
	return {
		env:{
			log: parseLogEnv(env)
		},
		raw: {env, argv},
		args
	}
}
