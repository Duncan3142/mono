#!/usr/bin/env bash

LOG_LEVEL_TRACE=0
LOG_LEVEL_DEBUG=1
LOG_LEVEL_INFO=2
LOG_LEVEL_WARN=3
LOG_LEVEL_ERROR=4

declare -A logLevels=(
	["trace"]=$LOG_LEVEL_TRACE
	["debug"]=$LOG_LEVEL_DEBUG
	["info"]=$LOG_LEVEL_INFO
	["warn"]=$LOG_LEVEL_WARN
	["error"]=$LOG_LEVEL_ERROR
)

# High Intensity
ICyan='\033[0;96m'        # Cyan
IBlue='\033[0;94m'        # Blue
IGreen='\033[0;92m'       # Green
IYellow='\033[0;93m'      # Yellow
IRed='\033[0;91m'         # Red
INC='\033[0m'             # No Color

declare -A logColors=(
	["trace"]=$ICyan
	["debug"]=$IBlue
	["info"]=$IGreen
	["warn"]=$IYellow
	["error"]=$IRed
)

MONO_LOG_LEVEL=${MONO_LOG_LEVEL:-info}

MONO_LOG_LEVEL_INDEX=-1

for level in "${!logLevels[@]}"; do
	if [[ $MONO_LOG_LEVEL == "$level" ]]; then
		MONO_LOG_LEVEL_INDEX=${logLevels[$level]}
		break
	fi
done

if [[ $MONO_LOG_LEVEL_INDEX -eq -1 ]]; then
	echo "Invalid log level: $MONO_LOG_LEVEL"
	exit 1
fi

function mono_log_level() {
	local level=${1:?}
	local levelIndex=${logLevels[$level]:--1}
	if [[ $levelIndex -eq -1 ]]; then
		echo "Invalid log level: $level"
		return 1
	fi
	if [[ $levelIndex -ge $MONO_LOG_LEVEL_INDEX ]]; then
		return 0
	fi
	return 1
}

function mono_log() {
	local level=${1:?}
	local levelIndex=${logLevels[$level]:--1}
	if [[ $levelIndex -eq -1 ]]; then
		echo "Invalid log level: $level"
		return 1
	fi
	shift
	local message=${1:?}
	shift
	local args=("${@}")

	if [[ $levelIndex -ge $MONO_LOG_LEVEL_INDEX ]]; then
		local color=${logColors[$level]}
		echo -e "${color}$message${INC}"
		if [[ "${#args[@]}" -gt 0 ]]; then
			for arg in "${args[@]}"; do
				echo -E "$arg"
			done
		fi
	fi
}

export -f mono_log
