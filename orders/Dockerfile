FROM  node:18

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY index.js .

EXPOSE 3000

CMD ["yarn", "start"]
