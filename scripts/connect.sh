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


echo "Runing the \"CREATE DATABASE quickstart;\" to create the db quickstart"

# Create the databasse 
QUERY="CREATE DATABASE quickstart;"
sqlcmd -S "$SERVER,$PORT" -U "$USERNAME" -P "$PASSWORD" -Q "$QUERY"


# Instructions
echo "use this connection string in .env, note TLS is disabled in this connection string"
echo "sqlserver://localhost:1433;database=quickstart;user=SA;password=YourStrong!Passw0rd;encrypt=DANGER_PLAINTEXT"


echo "Run the following Query to check if the db is created
    SELECT name FROM sys.databases;
    GO;

    Run \"docker-compose down\" to remove Docker container

    Run  \"npx prisma migrate dev --name init\" for initial migration, make sure you setup DATABASE_URL in .env
"

# Stop and remove Docker containers
# docker-compose down