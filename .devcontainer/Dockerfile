FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# COPY ./profile.d /etc/profile.d
COPY ./setup /tmp/mono-devcon-setup

ENV VOLTA_HOME="/root/.volta"
ENV PATH="${VOLTA_HOME}/bin:${PATH}"
RUN /tmp/mono-devcon-setup/volta.sh && \
    /tmp/mono-devcon-setup/docker.sh && \
    /tmp/mono-devcon-setup/hadolint.sh
