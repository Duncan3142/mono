#!/usr/bin/env node

import {parseEnv as parseLogEnv, Logger} from './lib/log.js'
import {configuration} from './lib/config.js'

const {env,raw} = configuration({parseLogEnv})
const logger = new Logger(env.log)

logger.debug('Hello, Nodejs!', raw)
