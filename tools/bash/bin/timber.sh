#!/usr/bin/env bash

set -ueC
set -o pipefail

MONO_LOG_LEVEL=${MONO_LOG_LEVEL:-info}

# High Intensity
ICyan='\033[0;96m'   # Cyan
IBlue='\033[0;94m'   # Blue
IGreen='\033[0;92m'  # Green
IYellow='\033[0;93m' # Yellow
IRed='\033[0;91m'    # Red
INC='\033[0m'        # No Color

declare -a logLevels=(
	"trace"
	"debug"
	"info"
	"warn"
	"error"
)

declare -A logColors=(
	["trace"]=$ICyan
	["debug"]=$IBlue
	["info"]=$IGreen
	["warn"]=$IYellow
	["error"]=$IRed
)

function index {
	local search=$1
	local idx=0
	for level in "${logLevels[@]}"; do
		if [[ "$search" == "$level" ]]; then
			echo $idx
			return 0
		fi
		(( idx+=1 ))
	done
	echo -1
	return 1
}

declare logLevelIndex=-1

if ! logLevelIndex=$(index "$MONO_LOG_LEVEL"); then
	echo "Invalid MONO_LOG_LEVEL: $MONO_LOG_LEVEL"
	exit 1
fi

function enabled {
	local search=$1
	local searchIndex
	searchIndex=$(index "$search")
	if [[ $searchIndex -ge $logLevelIndex ]]; then
		return 0
	fi
	return 1
}

function log {
	local level=$1
	if ! enabled "$level"; then
		return 1
	fi
	shift
	local message=$1
	shift
	local args=("${@}")
	local color=${logColors[$level]:-$INC}
	echo -e "${color}${message}${INC}"
	for arg in "${args[@]}"; do
		echo -E "$arg"
	done
}

case $1 in
	"-l")
		if enabled "$2"; then
			exit 0
		fi
		exit 1
		;;
	*)
		log "$@"
		;;
esac
