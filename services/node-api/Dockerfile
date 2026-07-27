FROM node:22-alpine

# The runtime only ever runs `node src/server.js`. The bundled package managers
# are unused attack surface and carry their own CVEs, so drop them.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /opt/yarn-* \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/yarn \
           /usr/local/bin/yarnpkg \
           /usr/local/bin/corepack

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY src ./src

USER node
EXPOSE 3000

CMD ["node", "src/server.js"]
