# Instructions

* Open Docker Desktop 

* Elevates the script's rights using this command:
  - chomd -x scripts/connect.sh

* Run the script
  - scripts/connect.sh

* To connect to the database, create a db and see all dbs 
  * sqlcmd -S localhost,1433 -U SA -P YourStrong!Passw0rd
    - CREATE DATABASE YourDatabaseName;
    - GO
    - SELECT name FROM sys.databases;
    - Go



# Resources about Prisma and SQL Server 
https://www.prisma.io/docs/concepts/database-connectors/sql-server
https://www.prisma.io/docs/concepts/database-connectors/sql-server/sql-server-docker#connection-url-credentials
https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver15&pivots=cs1-cmd#connect-to-sql-server
https://github.com/prisma/prisma/discussions/5817

* m-m relationship 
  * https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/working-with-many-to-many-relations



# Additional Resources on Fastify
https://github.com/TomDoesTech/fastify-prisma-rest-api/blob/main/NOTES.md
https://www.prisma.io/fastify
https://duncanlew.medium.com/build-a-node-js-server-with-fastify-and-typescript-a0f7225afddc
https://www.fastify.io/docs/latest/Guides/Getting-Started/
https://www.fastify.io/ecosystem/
https://www.youtube.com/watch?v=LMoMHP44-xM
https://github.com/TomDoesTech/fastify-prisma-rest-api/blob/main/NOTES.md


## Additional Steps
* Fastify Logger to prettify dev enviromenet Logging:
  - npm i -D pino-pretty 

* To Run additional Migrations 
  - npx prisma migrate dev --name MigrationName
  
* To Open Prisma Studion and inspect Tables
  - npx prisma studio


