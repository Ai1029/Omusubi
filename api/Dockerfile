FROM golang:latest

WORKDIR /usr/src/api

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]