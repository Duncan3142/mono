FROM ubuntu:22.04

SHELL ["/bin/bash", "-o", "pipefail", "-euC", "-c"]

# hadolint ignore=DL3008,SC2174
RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install --no-install-recommends -y 'curl' 'ca-certificates' \
	&& curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&&  mkdir -p -m 755 /etc/apt/keyrings \
	&& curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& apt-get install --no-install-recommends -y 'nodejs' 'git' 'gh' 'jq' \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	echo Done

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
