FROM mcr.microsoft.com/devcontainers/universal:3-linux

COPY ./scripts /tmp/scripts
COPY ./scripts/profile.d /etc/profile.d

RUN /tmp/scripts/setup.sh
