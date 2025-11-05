FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# COPY ./profile.d /etc/profile.d
COPY ./setup /tmp/mono-devcon-setup
COPY ./.config /root/.config

ENV VOLTA_HOME="/root/.volta"
ENV PATH="${VOLTA_HOME}/bin:${PATH}"

ENV DOT_NET_TOOLS="/root/.dotnet/tools"
ENV PATH="${DOT_NET_TOOLS}:${PATH}"

ENV PATH="/root/.local/bin:${PATH}"

RUN /tmp/mono-devcon-setup/volta.sh && \
    /tmp/mono-devcon-setup/docker.sh && \
    /tmp/mono-devcon-setup/hadolint.sh && \
    /tmp/mono-devcon-setup/dotnet.sh && \
    /tmp/mono-devcon-setup/gh-cli.sh && \
    /tmp/mono-devcon-setup/parallel.sh && \
    /tmp/mono-devcon-setup/mise.sh
