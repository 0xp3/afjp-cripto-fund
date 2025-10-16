#!/bin/bash

# AFJP Crypto Database Initialization Script
# This script creates a new database and user with secure credentials

set -e

echo "🚀 Initializing AFJP Crypto Database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run 'cp env.example .env' first and configure your settings."
    exit 1
fi

# Load environment variables
source .env

# Check if required environment variables are set
if [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
    echo "❌ Missing required environment variables. Please check your .env file:"
    echo "   - POSTGRES_DB"
    echo "   - POSTGRES_USER" 
    echo "   - POSTGRES_PASSWORD"
    exit 1
fi

echo "📊 Database: $POSTGRES_DB"
echo "👤 User: $POSTGRES_USER"
echo "🔐 Password: [HIDDEN]"

# Create database
echo "🗄️ Creating database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"
sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB;"

# Create user
echo "👤 Creating user..."
sudo -u postgres psql -c "DROP USER IF EXISTS $POSTGRES_USER;"
sudo -u postgres psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"

# Grant privileges
echo "🔑 Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"
sudo -u postgres psql -d $POSTGRES_DB -c "GRANT ALL ON SCHEMA public TO $POSTGRES_USER;"
sudo -u postgres psql -d $POSTGRES_DB -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $POSTGRES_USER;"
sudo -u postgres psql -d $POSTGRES_DB -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $POSTGRES_USER;"

# Create tables using Prisma
echo "🏗️ Creating database schema..."
npm run db:push

echo "✅ Database initialization complete!"
echo ""
echo "🎉 Your database is ready with:"
echo "   - Database: $POSTGRES_DB"
echo "   - User: $POSTGRES_USER"
echo "   - Tables: All AFJP Crypto tables created"
echo ""
echo "🚀 You can now start the backend with: npm run dev"