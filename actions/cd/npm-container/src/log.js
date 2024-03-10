import {argv, env} from "node:process"

console.log("Hello Nodejs!")

const args = argv.slice(2)

const {LOG_LEVEL: LOG_LEVEL_ENV} = env

const LOG_LEVEL = {
	TRACE:0,
	DEBUG:1,
	INFO:2,
	WARN:3,
	ERROR:4,
}

const logLevel =  Number.parseInt(LOG_LEVEL_ENV ?? LOG_LEVEL.INFO.toString(10), 10)

if (logLevel <= LOG_LEVEL.DEBUG) {
	console.log('Env:', JSON.stringify(env, null, '\t'))
	console.log('Args:', JSON.stringify(args))
}
