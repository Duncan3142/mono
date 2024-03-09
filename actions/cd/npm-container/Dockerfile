FROM node:lts-alpine

RUN apk add --no-cache 'bash>=5.2.21-r0' 'git>=2.43.0-r0' 'github-cli>=2.39.2-r1' 'make>=4.4.1-r2' 'docker-cli>=25.0.3-r1' 'jq>=1.7.1-r0'

SHELL ["/bin/bash", "-c"]

ENV ACTION_DIR=/action
ENV PATH=${ACTION_DIR}/shell:${PATH}

WORKDIR ${ACTION_DIR}

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

ENTRYPOINT [ "/action/cd.sh" ]

CMD [ ]
