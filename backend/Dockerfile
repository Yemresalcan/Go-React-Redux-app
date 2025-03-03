FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Use a minimal alpine image for the final stage
FROM alpine:3.18

WORKDIR /app

# Install certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the binary and schema file from the builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/schema.sql .

# Make the binary executable
RUN chmod +x ./main

# Set the entry point
ENTRYPOINT ["./main"]
