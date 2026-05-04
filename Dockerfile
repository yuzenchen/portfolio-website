###############################################################################
# Stage 1 — build the static site
###############################################################################
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time env.
#  - PUBLIC_FORMSPREE_ENDPOINT: contact form target
#  - BASE_PATH: site base path. Default "/" so the image serves at the root
#    (matches our nginx config). For GH Pages pass "/portfolio-website".
ARG PUBLIC_FORMSPREE_ENDPOINT=""
ARG BASE_PATH="/"
ARG SITE="http://localhost"
ENV PUBLIC_FORMSPREE_ENDPOINT=$PUBLIC_FORMSPREE_ENDPOINT
ENV BASE_PATH=$BASE_PATH
ENV SITE=$SITE

COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build

###############################################################################
# Stage 2 — serve via nginx
###############################################################################
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=2s --retries=3 \
  CMD wget --quiet --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
