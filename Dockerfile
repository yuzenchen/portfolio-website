###############################################################################
# Stage 1 — build the static site
###############################################################################
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time env. Pass with: docker build --build-arg PUBLIC_FORMSPREE_ENDPOINT=...
ARG PUBLIC_FORMSPREE_ENDPOINT=""
ENV PUBLIC_FORMSPREE_ENDPOINT=$PUBLIC_FORMSPREE_ENDPOINT

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
