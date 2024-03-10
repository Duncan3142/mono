#!/usr/bin/env bash

export LOG_LEVEL_TRACE=0
export LOG_LEVEL_DEBUG=1
export LOG_LEVEL_INFO=2
export LOG_LEVEL_WARN=3
export LOG_LEVEL_ERROR=4

export LOG_LEVEL=${LOG_LEVEL:-$LOG_LEVEL_INFO}

# High Intensity
ICyan='\033[0;96m'        # Cyan
IBlue='\033[0;94m'        # Blue
IGreen='\033[0;92m'       # Green
IYellow='\033[0;93m'      # Yellow
IRed='\033[0;91m'         # Red
INC='\033[0m'             # No Color

function log_trace() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_TRACE ]]; then
		echo -e "${ICyan}$*${INC}"
	fi
}

function log_debug() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]]; then
		echo -e "${IBlue}$*${INC}"
	fi
}

function log_info() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_INFO ]]; then
		echo -e "${IGreen}$*${INC}"
	fi
}

function log_warn() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_WARN ]]; then
		echo -e "${IYellow}$*${INC}"
	fi
}

function log_error() {
	if [[ $LOG_LEVEL -le $LOG_LEVEL_ERROR ]]; then
		echo -e "${IRed}$*${INC}"
	fi
}

export -f log_trace log_debug log_info log_warn log_error
