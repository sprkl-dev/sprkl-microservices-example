FROM  node:18-alpine

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .
COPY src src

CMD ["yarn", "start"]
