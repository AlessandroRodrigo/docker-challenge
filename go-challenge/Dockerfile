FROM golang:alpine as builder

RUN mkdir /app
WORKDIR /app

RUN go mod init app

COPY . .

RUN go build -o app

FROM scratch as production

COPY --from=builder /app /

CMD ["./app"]