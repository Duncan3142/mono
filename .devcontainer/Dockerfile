FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# COPY ./profile.d /etc/profile.d
COPY ./scripts /tmp/scripts

USER root
# Add the 'vscode' user to the 'root' group (GID 0).
# Required to read/write to the "/workspace" directory, mounted from the host.
RUN usermod -aG root vscode

USER vscode
ENV VOLTA_HOME="/home/vscode/.volta"
ENV PATH="${VOLTA_HOME}/bin:${PATH}"
RUN /tmp/scripts/volta.sh
