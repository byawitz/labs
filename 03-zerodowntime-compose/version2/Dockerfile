FROM golang:1.23-alpine AS compile

RUN mkdir -p /app
WORKDIR /app
COPY ./version2/server.go /app/
RUN go build server.go

FROM alpine:3.20.3

RUN mkdir -p /app
WORKDIR /app
COPY --from=compile /app/server /app/

CMD ["/app/server"]
