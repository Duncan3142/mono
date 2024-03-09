import "./src/log.js"
import {argv, env} from "node:process"

const args = argv.slice(2)

console.log('Env:', JSON.stringify(env, null, '\t'))
console.log('Args:', JSON.stringify(args))
