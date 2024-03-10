import {argv, env} from "node:process"
import { parseEnv } from "./log"

const args = argv.slice(2)

export const environment = {
	 env:{
		log: parseEnv(env)
	},
	raw: {env, argv},
	args
}
