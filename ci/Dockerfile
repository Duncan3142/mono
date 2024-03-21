FROM ubuntu:22.04

SHELL ["/bin/bash", "-o", "pipefail", "-euC", "-c"]

# hadolint ignore=DL3008,SC2174,DL3009
RUN apt-get update \
&& apt-get upgrade -y \
&& apt-get install --no-install-recommends -y 'curl' 'ca-certificates' 'git' 'gh' 'jq' 'parallel' \
&& curl -fsSL https://get.volta.sh | bash \
&& apt-get clean \
&& echo Done

ENV ACTION_DIR=/action
ENV LBIN=/usr/local/bin
ENV LLIB=/usr/local/mono
ENV MONO_LOGS_ROOT=${ACTION_DIR}/logs
ENV VOLTA_HOME="/root/.volta"
ENV PATH="$VOLTA_HOME/bin:$PATH"

WORKDIR ${ACTION_DIR}

COPY . .

ENV GIT_WORKSPACE=/github/workspace

WORKDIR ${GIT_WORKSPACE}

RUN ${ACTION_DIR}/setup.sh

ENTRYPOINT [ "github-npm-cd" ]

CMD [ ]
