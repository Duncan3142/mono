FROM ubuntu:22.04

# RUN apt-get install 'git>=2.43.0-r0' 'github-cli>=2.39.2-r1' 'jq>=1.7.1-r0' 'nodejs>=20.11.1-r0' 'npm>=10.2.5-r0'

SHELL ["/bin/bash", "-c"]

ENV ACTION_DIR=/action
ENV LBIN=${ACTION_DIR}/bin
ENV MONO_LOGS_ROOT=${ACTION_DIR}/logs
ENV PATH=${LBIN}:${PATH}

WORKDIR ${ACTION_DIR}

COPY . .

ENV GITHUB_WORKSPACE=/github/workspace

WORKDIR ${GITHUB_WORKSPACE}

ENTRYPOINT [ "/action/setup.sh" ]

CMD [ ]
