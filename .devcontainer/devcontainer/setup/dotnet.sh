#! /usr/bin/env bash

set -ueC
set -o pipefail

dotnet_version="9.0"

# .NET SDK
apt-get install -y software-properties-common
add-apt-repository -y ppa:dotnet/backports
apt-get install -y "dotnet-sdk-${dotnet_version}"

# Powershell
dotnet tool install --global PowerShell

# Oh My Posh
# curl -s https://ohmyposh.dev/install.sh | bash -s
# oh-my-posh font install meslo
