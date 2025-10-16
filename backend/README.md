# AFJP Crypto Backend

**Complete Backend API for AFJP Crypto Platform**

A production-ready Node.js backend that integrates with Aptos Move smart contracts for retirement and real estate investment management.

## What This Backend Does

This backend powers the AFJP Crypto ecosystem, providing:
- **Token Management** for AFJP, Juventud, and Ladrillo tokens
- **Vesting System** with 5-year schedules and cliff periods
- **Staking Rewards** and token distribution
- **Real Estate Tokenization** and property auctions
- **Collateralized Lending** system
- **Family Inheritance** management
- **Comprehensive Analytics** and reporting
- **Secure Authentication** via wallet signatures

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript execution |
| **Framework** | Express.js | Web API framework |
| **Language** | TypeScript | Type-safe development |
| **Database** | PostgreSQL 15+ | Primary data storage |
| **ORM** | Prisma | Database management |
| **Blockchain** | Aptos SDK | Move contract integration |
| **Caching** | Redis | Session & data caching |
| **Documentation** | Swagger/OpenAPI | API documentation |
| **Validation** | Zod | Request validation |
| **Testing** | Jest + Supertest | Unit & integration tests |

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)
- **Redis 7+** - [Download here](https://redis.io/download)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional) - [Download here](https://www.docker.com/)

## Quick Start

### Step 1: Clone & Install
```bash
git clone git@github.com:0xp3/AFJP-Aptos.git
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp env.example .env
# Edit .env with your secure configuration
# IMPORTANT: Change all default passwords and secrets!
```

### Step 3: Set Up Database
```bash
# Automated setup (recommended)
./scripts/init-db.sh

# OR manual setup
npm run db:push
```

### Step 4: Start Development
```bash
npm run dev
```

**Your API is now running at `http://localhost:3000`**

## 📖 Detailed Setup Guide

### Option A: Automated Setup (Recommended)
```bash
# Run the setup script
./scripts/setup.sh

# This will:
# ✅ Install dependencies
# ✅ Generate Prisma client
# ✅ Guide you through configuration
```

### Option B: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp env.example .env

# 3. Edit .env with your values
nano .env

# 4. Initialize database
./scripts/init-db.sh

# 5. Generate Prisma client
npm run db:generate

# 6. Start development server
npm run dev
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:init` | Initialize database |
| `npm run db:push` | Push schema changes |
| `npm run db:studio` | Open Prisma Studio |

## API Documentation

Once running, access:
- ** Swagger UI**: `http://localhost:3000/api-docs`
- ** Health Check**: `http://localhost:3000/health`
- ** Prisma Studio**: `http://localhost:5555` (if using Docker)

## Docker Setup

### Quick Docker Start
```bash
docker-compose up -d
```

### What Gets Started
| Service | Port | Purpose |
|---------|------|---------|
| **Backend API** | 3002 | Main API server |
| **PostgreSQL** | 5434 | Database |
| **Redis** | 6381 | Caching |
| **pgAdmin** | 5052 | Database management UI |

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## Environment Variables

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `afjp_crypto` |
| `POSTGRES_USER` | Database user | `afjp_user` |
| `POSTGRES_PASSWORD` | Database password | `your_secure_password` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |
| `AFJP_MODULE_ADDRESS` | Aptos module address | `0x1234...` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Full PostgreSQL URL | Auto-generated |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `APTOS_NODE_URL` | Aptos node URL | `https://fullnode.devnet.aptoslabs.com` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

### Security Notes
- **Never commit `.env` files**
- **Use strong, unique passwords**
- **Generate secure JWT secrets**
- **Use different values for each environment**

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/wallet-connect` | Connect wallet |
| `POST` | `/api/auth/verify-signature` | Verify signature |
| `POST` | `/api/auth/refresh` | Refresh token |
| `POST` | `/api/auth/logout` | Logout |

### Token Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tokens/afjp/balance/:address` | Get AFJP balance |
| `GET` | `/api/tokens/juventud/balance/:address` | Get Juventud balance |
| `GET` | `/api/tokens/ladrillo/balance/:address` | Get Ladrillo balance |
| `POST` | `/api/tokens/afjp/transfer` | Transfer AFJP tokens |
| `POST` | `/api/tokens/afjp/burn` | Burn AFJP tokens |
| `GET` | `/api/tokens/transactions/:address` | Get transaction history |

### Vesting System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/vesting/schedule/:address` | Get vesting schedule |
| `POST` | `/api/vesting/release` | Release vested tokens |
| `GET` | `/api/vesting/calculate/:address` | Calculate vested amount |

### Staking
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/staking/info/:address` | Get staking info |
| `POST` | `/api/staking/stake` | Stake tokens |
| `POST` | `/api/staking/unstake` | Unstake tokens |
| `POST` | `/api/staking/claim-rewards` | Claim rewards |
| `GET` | `/api/staking/rewards/:address` | Get pending rewards |

### Property Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/properties` | Get all properties |
| `GET` | `/api/properties/:id` | Get property by ID |
| `POST` | `/api/properties/register` | Register property |
| `POST` | `/api/properties/tokenize` | Tokenize property |
| `GET` | `/api/properties/auctions` | Get active auctions |
| `POST` | `/api/properties/auctions/:id/bid` | Place bid |
| `GET` | `/api/properties/rental-income/:address` | Get rental income |

### Lending System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lending/loans/:address` | Get loans |
| `POST` | `/api/lending/create-loan` | Create loan |
| `POST` | `/api/lending/repay` | Repay loan |
| `GET` | `/api/lending/collateral/:address` | Get collateral info |
| `POST` | `/api/lending/liquidate` | Liquidate collateral |

### Inheritance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/inheritance/beneficiaries/:address` | Get beneficiaries |
| `POST` | `/api/inheritance/designate` | Designate beneficiaries |
| `POST` | `/api/inheritance/request` | Request inheritance |
| `GET` | `/api/inheritance/requests/:address` | Get inheritance requests |
| `POST` | `/api/inheritance/execute/:requestId` | Execute inheritance |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/fund-performance` | Get fund performance |
| `GET` | `/api/analytics/user-portfolio/:address` | Get user portfolio |
| `GET` | `/api/analytics/property-valuations` | Get property valuations |
| `GET` | `/api/analytics/market-trends` | Get market trends |

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- authController.test.ts
```

### Test Coverage
- Unit tests for all controllers
- Integration tests for API endpoints
- Mocked database and external services

## Database Management

### Prisma Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Initialize database
npm run db:init
```

## Logging & Monitoring

### Log Files
- **Console**: Development logs
- **`logs/combined.log`**: All application logs
- **`logs/error.log`**: Error logs only

### Monitoring Features
- Health check endpoint (`/health`)
- Request/response logging
- Error tracking and reporting
- Performance metrics
- Database query logging

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Wallet signature verification
- Rate limiting per IP
- Input validation with Zod
- SQL injection protection
- CORS configuration

### Data Protection
- Environment variable security
- No hardcoded secrets
- Automatic secret rotation support
- Secure database initialization

## Quick Troubleshooting

### Common Issues

** Database Connection Error**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

** Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

** Permission Denied on Scripts**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

** Prisma Client Not Generated**
```bash
# Generate Prisma client
npm run db:generate
```

### Getting Help

1. **Check the logs**: `docker-compose logs -f`
2. **Verify environment**: Ensure `.env` is properly configured
3. **Test database**: `npm run db:studio`
4. **Run health check**: `curl http://localhost:3000/health`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

---
 

**Next Steps:**
1. Configure your `.env` file
2. Run `./scripts/init-db.sh`
3. Start with `npm run dev`
4. Visit `http://localhost:3000/api-docs` for API documentation


