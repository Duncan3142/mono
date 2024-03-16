FROM ubuntu:22.04

SHELL ["/bin/bash", "-o", "pipefail", "-euC", "-c"]

# hadolint ignore=DL3008,SC2174,DL3009
RUN apt-get update \
&& apt-get upgrade -y \
&& apt-get install --no-install-recommends -y 'curl' 'ca-certificates' 'git' 'gh' 'jq' \
&& apt-get clean \
&& curl -fsSL https://get.volta.sh | bash \
&& echo Done

ENV ACTION_DIR=/action
ENV LBIN=${ACTION_DIR}/bin
ENV PATH=${LBIN}:${PATH}
ENV MONO_LOGS_ROOT=${ACTION_DIR}/logs

WORKDIR ${ACTION_DIR}

COPY . .

ENV GITHUB_WORKSPACE=/github/workspace

WORKDIR ${GITHUB_WORKSPACE}

ENTRYPOINT [ "/action/setup.sh" ]

CMD [ ]
