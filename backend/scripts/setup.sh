#!/bin/bash

# AFJP Crypto Backend Setup Script
echo "🚀 Setting up AFJP Crypto Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your secure values:"
    echo "   - Change POSTGRES_PASSWORD to a strong password"
    echo "   - Change JWT_SECRET to a random, secure string"
    echo "   - Update AFJP_MODULE_ADDRESS with your actual module address"
    echo ""
    echo "🔐 Security reminder:"
    echo "   - Never commit .env files to version control"
    echo "   - Use different secrets for each environment"
    echo "   - Consider using a password manager for secrets"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your secure values"
echo "2. Initialize the database: ./scripts/init-db.sh"
echo "3. Start the development server: npm run dev"
echo ""
echo "📚 API Documentation will be available at: http://localhost:3000/api-docs"
echo "🏥 Health Check will be available at: http://localhost:3000/health"
