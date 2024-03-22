# Build Stage
FROM node:alpine as build-stage
WORKDIR /code
COPY frontend/ /code
RUN npm install
RUN npm run build

# Production Stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /code/dist /usr/share/nginx/html
RUN apk update && \
	apk add --no-cache openssl
COPY ./conf /etc/nginx/conf.d
EXPOSE 443
ENTRYPOINT exec nginx -g "daemon off;"