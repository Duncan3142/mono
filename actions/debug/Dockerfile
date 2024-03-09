FROM node:lts-alpine

RUN apk add --no-cache 'bash=5.2.21-r0' 'git=2.43.0-r0'

# SHELL [ "/bin/bash" ]

ENV ACTION_DIR=/action
ENV PATH=${ACTION_DIR}/shell:${PATH}
ENV REPO_DIR=/repo

WORKDIR ${ACTION_DIR}

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

WORKDIR /repo

ENTRYPOINT [ "/action/entry-point.sh" ]

CMD [ ]
