#!/bin/bash

DB_NAME="atlas"
DB_USER="admin"

# Disconnect all active connections
docker exec -e PGPASSWORD=1234 postgres psql -U $DB_USER -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '$DB_NAME';
"

# Drop the database
docker exec -e PGPASSWORD=1234 postgres psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"

# Recreate the database
docker exec -e PGPASSWORD=1234 postgres psql -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\";"