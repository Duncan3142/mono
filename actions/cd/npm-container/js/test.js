#!/usr/bin/env node

import {parseEnv as parseLogEnv, Logger} from './lib/log.js'
import {configuration} from './lib/env.js'

const config = configuration({parseLogEnv})
const logger = new Logger(config.log)

logger.info('Hello, Nodejs!', config)
