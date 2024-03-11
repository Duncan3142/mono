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
	echo -e "${ICyan}$*${INC}"
}

function log_debug() {
	echo -e "${IBlue}$*${INC}"
}

function log_info() {
	echo -e "${IGreen}$*${INC}"
}

function log_warn() {
	echo -e "${IYellow}$*${INC}"
}

function log_error() {
	echo -e "${IRed}$*${INC}"
}

export -f log_trace log_debug log_info log_warn log_error
