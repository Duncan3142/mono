#!/usr/bin/env bash

set -ueC

MONO_LOG_LEVEL=${MONO_LOG_LEVEL:-info}

# High Intensity
ICyan='\033[0;96m'   # Cyan
IBlue='\033[0;94m'   # Blue
IGreen='\033[0;92m'  # Green
IYellow='\033[0;93m' # Yellow
IRed='\033[0;91m'    # Red
INC='\033[0m'        # No Color

declare -A logLevels=(
	["trace"]=$ICyan
	["debug"]=$IBlue
	["info"]=$IGreen
	["warn"]=$IYellow
	["error"]=$IRed
)

function index {
	local search=$1
	local -i i=-1
	for level in "${!logLevels[@]}"; do
		((i++))
		if [[ "$search" == "$level" ]]; then
			echo i
			return 0
		fi
	done
	return 1
}

if ! logLevelIndex=$(index "$MONO_LOG_LEVEL"); then
	echo "Invalid MONO_LOG_LEVEL: $MONO_LOG_LEVEL"
	exit 1
fi

function enabled {
	local search=$1
	if [[ $(index "$search") -ge $logLevelIndex ]]; then
		return 0
	fi
	return 1
}

function log {
	local level=${1}
	if ! enabled "$level"; then
		return 1
	fi
	shift
	local message=${1}
	shift
	local args=("${@}")
	local color=${logLevels[$level]}
	echo -e "${color}$message${INC}"
	for arg in "${args[@]}"; do
		echo -E "$arg"
	done
}

case $1 in
	"-l")
		shift
		if enabled "$1"; then
			exit 0
		fi
		exit 1
		;;
	*)
		log "$@"
		;;
esac
