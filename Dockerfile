FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /backend
COPY backend/pom.xml .
COPY backend/src ./src
RUN apk add --no-cache maven && mvn -q -DskipTests package

FROM node:20-alpine AS frontend-build
WORKDIR /frontend
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
RUN pnpm run build

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache nginx wget && mkdir -p /run/nginx /etc/nginx/http.d
COPY --from=backend-build /backend/target/*.jar /app/app.jar
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html
COPY deploy/nginx-app.conf.template /etc/nginx/app.conf.template
COPY deploy/start.sh /start.sh
RUN chmod +x /start.sh

ENV PORT=10000
EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD wget -qO- http://127.0.0.1:10000/api/processes >/dev/null || exit 1

CMD ["/start.sh"]
