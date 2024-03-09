import {argv, env} from "node:process"

console.log("Hello Nodejs!")

const args = argv.slice(2)

console.log('Env:', JSON.stringify(env, null, '\t'))
console.log('Args:', JSON.stringify(args))
