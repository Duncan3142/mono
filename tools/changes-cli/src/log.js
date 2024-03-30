/**
 * @param {ProcessEnv} env
 */
export const parseEnv = (env) => {
	const {LOG_LEVEL} = env
	return {
		level : LOG_LEVEL !== undefined ? Number.parseInt(LOG_LEVEL, 10) : LOG_LEVEL.INFO
	}
}

const LOG_LEVEL = {
	TRACE:0,
	DEBUG:1,
	INFO:2,
	WARN:3,
	ERROR:4,
}

const pretty = (args) => args.map((arg, index) => index > 0 ? JSON.stringify(arg, null, '\t') : arg)

export class Logger {
	#level = LOG_LEVEL.INFO
	constructor(props) {
		const {level} = props
		this.#level = level
	}

	trace  (...args) {
		if (this.#level <= LOG_LEVEL.TRACE) {
			console.trace(...pretty(args))
		}
	}
	debug  (...args) {
		if (this.#level <= LOG_LEVEL.DEBUG) {
			console.debug(...pretty(args))
		}
	}
	info  (...args) {
		if (this.#level <= LOG_LEVEL.INFO) {
			console.info(...pretty(args))
		}
	}
	warn  (...args) {
		if (this.#level <= LOG_LEVEL.WARN) {
			console.warn(...pretty(args))
		}
	}
	 error  (...args) {
		if (this.#level <= LOG_LEVEL.ERROR) {
			console.error(...pretty(args))
		}
	}
}
