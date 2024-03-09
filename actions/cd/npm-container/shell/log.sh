#!/usr/bin/env bash

export LOG_LEVEL_TRACE=0
export LOG_LEVEL_DEBUG=1
export LOG_LEVEL_INFO=2
export LOG_LEVEL_WARN=3
export LOG_LEVEL_ERROR=4

export LOG_LEVEL=${LOG_LEVEL:-$LOG_LEVEL_INFO}

function log_info() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_INFO ]]; then
		echo "$*"
	fi
}

export -f log_info
