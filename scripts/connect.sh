#!/bin/bash

# Database connection details
SERVER="localhost"
PORT="1433"
USERNAME="SA"
PASSWORD="YourStrong!Passw0rd"
DATABASE="quickstart"

# Start Docker containers
docker-compose up -d

# Wait for containers to start
sleep 5

# Create the databasse 
QUERY="CREATE DATABASE quickstart;GO;"
sqlcmd -S "$SERVER,$PORT" -U "$USERNAME" -P "$PASSWORD"


echo("use this connection string in .env")
echo("sqlserver://localhost:1433;database=quickstart;user=SA;password=YourStrong!Passw0rd;encrypt=DANGER_PLAINTEXT")

# Stop and remove Docker containers
# docker-compose down