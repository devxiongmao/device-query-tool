# Backend - Device Capabilities Query Tool

The backend API for the Device Capabilities Query Tool, a high-performance GraphQL API built with Hono, Bun, PostgreSQL, and GraphQL Yoga. This package provides a robust, type-safe API for querying device RF capabilities, bands, carrier aggregation combos, and network features.

## 🎯 Overview

This backend application provides:

- **GraphQL API**: Type-safe, efficient queries with automatic batching and caching
- **Device Queries**: Search devices by vendor, model number, or market name
- **Capability Queries**: Find devices by bands, combos, or features
- **Provider Filtering**: Toggle between global capabilities and provider-specific certifications
- **Performance Optimizations**: DataLoaders prevent N+1 queries, query complexity limits prevent abuse
- **Security**: Rate limiting, query depth limiting, and complexity analysis

For the complete project overview, see the [main README](../../README.md).

---

## 🛠️ Technology Stack

### Core Framework

- **Bun 1.x**: Lightning-fast JavaScript runtime and package manager
- **Hono 4.x**: Ultra-fast web framework optimized for edge runtimes
- **TypeScript 5.9**: Full type safety across the entire application

### GraphQL

- **GraphQL Yoga 5.x**: Modern GraphQL server with built-in performance features
- **Pothos 4.x**: Code-first GraphQL schema builder with excellent type inference
- **@pothos/plugin-relay**: Relay-compatible pagination support

### Database

- **PostgreSQL 16.x**: Robust relational database for complex device relationships
- **Drizzle ORM 0.44**: Type-safe SQL query builder with excellent TypeScript support
- **postgres.js**: Fast PostgreSQL client for Node.js

### Performance & Security

- **DataLoader**: Automatic batching and caching to prevent N+1 queries
- **Query Complexity Analysis**: Prevent expensive queries from overloading the server
- **Query Depth Limiting**: Maximum depth of 5 levels to prevent deeply nested queries
- **Rate Limiting**: 100 requests/minute, 1000 requests/hour per IP

### Validation & Configuration

- **Zod 4.x**: TypeScript-first schema validation
- **dotenv**: Environment variable management

### Testing

- **Vitest 4.x**: Fast unit test framework
- **@faker-js/faker**: Test data generation

---

## 📁 Project Structure

```
src/
├── app.ts                 # Hono application setup and routes
├── index.ts               # Application entry point
├── config/
│   └── env.ts             # Environment variable validation with Zod
├── db/
│   ├── client.ts          # Database connection and Drizzle setup
│   ├── schema.ts          # Drizzle schema definitions
│   ├── seed.ts            # Database seeding script
│   └── migrations/        # Database migration files
├── graphql/
│   ├── context.ts         # GraphQL context creation
│   ├── loaders.ts         # DataLoader definitions
│   ├── test-loaders.ts    # Test-specific loaders
│   ├── yoga.ts            # GraphQL Yoga server configuration
│   └── schema/
│       ├── builder.ts     # Pothos schema builder
│       ├── index.ts       # Schema export
│       ├── queries/       # GraphQL query resolvers
│       │   ├── device.queries.ts
│       │   ├── capability.queries.ts
│       │   ├── combo.queries.ts
│       │   ├── band.queries.ts
│       │   ├── feature.queries.ts
│       │   └── provider.queries.ts
│       └── types/         # GraphQL type definitions
│           ├── device.ts
│           ├── software.ts
│           ├── band.ts
│           ├── combo.ts
│           ├── feature.ts
│           ├── provider.ts
│           ├── junctions.ts
│           └── capability-results.ts
├── middleware/
│   ├── cors.ts            # CORS configuration
│   ├── error-handler.ts   # Global error handling
│   └── logger.ts          # Request logging
└── repositories/
    ├── index.ts           # Repository exports
    ├── types.ts           # Repository type definitions
    ├── device.repository.ts
    ├── software.repository.ts
    ├── band.repository.ts
    ├── combo.repository.ts
    ├── feature.repository.ts
    ├── provider.repository.ts
    └── test-repositories.ts  # Test-specific repositories
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun**: `1.x` or newer - [Install Bun](https://bun.sh)
- **PostgreSQL**: `16.x` or newer
- **Database**: Create a PostgreSQL database for development

### Installation

1. **Install Dependencies**:

   ```bash
   cd packages/backend
   bun install
   ```

2. **Configure Environment Variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```bash
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/device_capabilities
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=device_capabilities
   DB_USER=postgres
   DB_PASSWORD=postgres

   # Server
   PORT=3000
   NODE_ENV=development

   # CORS
   CORS_ORIGIN=http://localhost:5173

   # Logging
   LOG_LEVEL=info

   # GraphQL
   GRAPHQL_MAX_DEPTH=5
   GRAPHQL_MAX_COMPLEXITY=1000
   GRAPHQL_RATE_LIMIT_PER_MINUTE=100
   GRAPHQL_RATE_LIMIT_PER_HOUR=1000
   ```

3. **Setup Database**:

   ```bash
   # Generate migration from schema changes
   bun run db:generate

   # Apply migrations
   bun run db:migrate

   # Seed with test data
   bun run db:seed
   ```

4. **Start Development Server**:

   ```bash
   bun run dev
   ```

   The API will be available at:

   - **API**: http://localhost:3000
   - **GraphQL Playground**: http://localhost:3000/graphql
   - **Health Check**: http://localhost:3000/health

---

## 🗄️ Database Management

### Migrations

**Generate Migration** (after schema changes):

```bash
bun run db:generate
```

This creates migration files in `src/db/migrations/` based on changes to `src/db/schema.ts`.

**Apply Migrations**:

```bash
bun run db:migrate
```

**Push Schema Changes** (development only, bypasses migrations):

```bash
bun run db:push
```

**Open Drizzle Studio** (visual database browser):

```bash
bun run db:studio
```

### Seeding

Seed the database with test data:

```bash
bun run db:seed
```

The seed script creates sample devices, software versions, bands, combos, features, and providers with realistic relationships.

### Schema Design

The database uses a complex many-to-many relationship structure:

- **Core Tables**: `DEVICE`, `SOFTWARE`, `BAND`, `COMBO`, `FEATURE`, `PROVIDER`
- **Junction Tables**: Track relationships between devices/software and capabilities
- **Provider-Specific Tables**: Separate tables for provider-certified capabilities
- **Composite Primary Keys**: Efficient querying of many-to-many relationships
- **Strategic Indexing**: 10+ indexes optimized for common query patterns

See the [main README](../../README.md#database-schema) for detailed schema documentation.

---

## 🧪 Testing

### Prerequisites for Testing

**⚠️ Important**: Before running tests, you must create a test database named `testdb`.

```bash
# Connect to PostgreSQL
psql -U postgres

# Create test database
CREATE DATABASE testdb;

# Exit psql
\q
```

### Test Configuration

Tests use a separate environment configuration. Create `.env.test`:

```bash
cp .env.example .env.test
```

Edit `.env.test` to point to the test database:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/testdb
DB_NAME=testdb
NODE_ENV=test
```

### Running Tests

**Run All Tests**:

```bash
bun run test
```

**Run Tests in Watch Mode**:

```bash
bun run test --watch
```

**Run Tests with Coverage**:

```bash
bun run test --coverage
```

**Run Specific Test File**:

```bash
bun run test tests/repositories/device.repository.test.ts
```

### Test Structure

- `tests/` - Test files
  - `globalSetup.ts` - Global test setup (loads `.env.test`)
  - `config/` - Configuration tests
  - `graphql/` - GraphQL query tests
  - `middleware/` - Middleware tests
  - `repositories/` - Repository tests
  - `factories/` - Test data factories

### Writing Tests

Tests use Vitest with mocks for database operations. Example:

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeviceRepository } from "../src/repositories/device.repository";
import { db } from "../src/db/client";

// Mock the database
vi.mock("../src/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("DeviceRepository", () => {
  let repository: DeviceRepository;

  beforeEach(() => {
    repository = new DeviceRepository();
    vi.clearAllMocks();
  });

  it("should search devices by vendor", async () => {
    // Test implementation
  });
});
```

---

## 🔧 Development Workflow

### Type Checking

```bash
bun run typecheck
```

Runs TypeScript compiler in check mode without emitting files.

### Linting

```bash
# Check for linting errors
bun run lint

# Auto-fix linting errors
bun run lint:fix
```

### Building for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

The build output is in the `dist/` directory.

---

## 📡 GraphQL API

### Endpoints

- **GraphQL Endpoint**: `POST http://localhost:3000/graphql`
- **GraphiQL Playground**: `GET http://localhost:3000/graphql` (development only)
- **Health Check**: `GET http://localhost:3000/health`

### Query Protection

The API includes several protection mechanisms:

- **Max Depth**: 5 levels (configurable via `GRAPHQL_MAX_DEPTH`)
- **Max Complexity**: 1000 points (configurable via `GRAPHQL_MAX_COMPLEXITY`)
- **Rate Limiting**:
  - 100 requests per minute per IP
  - 1000 requests per hour per IP

### Example Queries

**Query Devices**:

```graphql
query SearchDevices {
  devices(vendor: "Apple") {
    id
    vendor
    modelNum
    marketName
    software {
      name
      platform
    }
  }
}
```

**Query by Capability**:

```graphql
query DevicesByBand {
  devicesByBand(bandId: "25") {
    device {
      vendor
      modelNum
    }
    supportStatus
  }
}
```

**Query with Provider Filter**:

```graphql
query DeviceCapabilities {
  device(id: "1") {
    vendor
    modelNum
    bands(providerId: "1") {
      band {
        bandNumber
        technology
      }
    }
  }
}
```

### DataLoaders

The API uses DataLoaders to batch and cache database queries, preventing N+1 query problems:

- `deviceById`: Batch load devices by ID
- `softwareByDeviceId`: Batch load software versions for devices
- `bandsByDeviceSoftwareId`: Batch load bands for device/software combinations
- `combosByDeviceSoftwareId`: Batch load combos for device/software combinations
- `featuresByDeviceSoftwareProviderId`: Batch load features for device/software/provider combinations

---

## 🏗️ Architecture

### Repository Pattern

The backend uses a repository pattern to abstract database operations:

- **DeviceRepository**: Device CRUD operations
- **SoftwareRepository**: Software version management
- **BandRepository**: Band queries and filtering
- **ComboRepository**: Combo queries and filtering
- **FeatureRepository**: Feature queries
- **ProviderRepository**: Provider management

### GraphQL Schema

The GraphQL schema is built using Pothos, a code-first schema builder:

- **Types**: Defined in `src/graphql/schema/types/`
- **Queries**: Defined in `src/graphql/schema/queries/`
- **Builders**: Schema builder configuration in `src/graphql/schema/builder.ts`

### Middleware

- **CORS**: Configurable CORS middleware for cross-origin requests
- **Logger**: Request logging middleware
- **Error Handler**: Global error handling with proper status codes

---

## 🔌 Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `DB_PASSWORD`: Database password

### Optional Variables (with defaults)

- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_NAME`: Database name (default: `device_capabilities`)
- `DB_USER`: Database user (default: `postgres`)
- `PORT`: Server port (default: `3000`)
- `NODE_ENV`: Environment (default: `development`)
- `CORS_ORIGIN`: CORS allowed origin (default: `http://localhost:5173`)
- `LOG_LEVEL`: Logging level (default: `info`)
- `GRAPHQL_MAX_DEPTH`: Max query depth (default: `5`)
- `GRAPHQL_MAX_COMPLEXITY`: Max query complexity (default: `1000`)
- `GRAPHQL_RATE_LIMIT_PER_MINUTE`: Rate limit per minute (default: `100`)
- `GRAPHQL_RATE_LIMIT_PER_HOUR`: Rate limit per hour (default: `1000`)

---

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` in `.env` is correct
3. Verify database exists: `psql -U postgres -l`
4. Check connection: `psql $DATABASE_URL`

### Migration Issues

1. Ensure schema changes are saved in `src/db/schema.ts`
2. Run `bun run db:generate` to create migration
3. Check migration files in `src/db/migrations/`
4. Run `bun run db:migrate` to apply

### Test Database Issues

1. **Ensure `testdb` database exists**:

   ```bash
   createdb -U postgres testdb
   ```

2. Verify `.env.test` points to `testdb`:

   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/testdb
   ```

3. Check test database connection:
   ```bash
   psql -U postgres -d testdb -c "SELECT 1"
   ```

### GraphQL Playground Not Loading

1. Verify `NODE_ENV=development` in `.env`
2. Check server is running on correct port
3. Access via `http://localhost:3000/graphql` (not `/graphql/`)

### Rate Limit Errors

If you hit rate limits during development:

1. Increase limits in `.env`:

   ```bash
   GRAPHQL_RATE_LIMIT_PER_MINUTE=1000
   GRAPHQL_RATE_LIMIT_PER_HOUR=10000
   ```

2. Restart the server to apply changes

---

## 📚 Related Documentation

- [Main README](../../README.md) - Complete project overview and setup
- [Frontend README](../frontend/README.md) - Frontend application documentation
- [Development Plan](../../docs/Development_Plan_Device_Capabilities_Query_Tool.md) - Architecture and planning docs
- [Database Schema](../../README.md#database-schema) - Detailed schema documentation

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
