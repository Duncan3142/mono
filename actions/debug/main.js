#!/usr/bin/env node

import chalk from 'chalk'

const {redBright, blueBright, greenBright} = chalk

console.log(redBright('Hello'), blueBright('world'), greenBright('!'))
