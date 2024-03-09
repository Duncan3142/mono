FROM node:lts-alpine

RUN apk add --no-cache 'bash>=5.2.21-r0' 'git>=2.43.0-r0' 'github-cli>=github-cli-2.39.2-r1'

# SHELL [ "/bin/bash" ]

ENV ACTION_DIR=/action
ENV PATH=${ACTION_DIR}/shell:${PATH}

WORKDIR ${ACTION_DIR}

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

ENTRYPOINT [ "/action/entry-point.sh" ]

CMD [ ]
