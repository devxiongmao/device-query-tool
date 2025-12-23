# 📱 Device Capabilities Query Tool

A powerful GraphQL-powered platform for querying smartphone and device RF capabilities across different telecom providers. Built with modern technologies including React, TypeScript, Hono, and Bun, this tool enables network engineers, device testers, and telecom professionals to quickly search and analyze device support for bands, carrier aggregation combos, and advanced features.

**🌟 The Power of Comprehensive Data**: Access detailed information about device capabilities including frequency bands (GSM, HSPA, LTE, 5G NR), carrier aggregation combinations, and network features across multiple Canadian carriers. Whether you're qualifying devices for network deployment, answering customer inquiries, or conducting competitive analysis, this tool provides instant, accurate answers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.x-e10098.svg)](https://graphql.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-000000.svg)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌍 How Device Capabilities Works

### The Problem We Solve

Network engineers and telecom professionals face daily challenges:

- **Customer Questions**: "Does my iPhone support 5G on Telus?"
- **Device Testing**: Which devices need certification for n77 band support?
- **Network Planning**: What devices support EN-DC on our network?
- **Competitive Analysis**: How does device support compare across carriers?

Traditional solutions involve scattered spreadsheets, PDF spec sheets, and manual cross-referencing. **Device Capabilities centralizes this data with instant, filterable access.**

### Dual Query Approach

**📱 Query by Device**

Search for a specific device and instantly see:
- All supported frequency bands (globally or per-provider)
- Carrier aggregation combinations (LTE CA, EN-DC, NR CA)
- Network features (VoLTE, VoWiFi, 5G SA, etc.)
- Software version details and release dates
- Filterable by technology (GSM/HSPA/LTE/5G)

**📡 Query by Capability**

Search by a specific capability and find all supporting devices:
- **By Band**: Find all devices supporting Band 71, n77, etc.
- **By Combo**: Find devices with specific CA combinations
- **By Feature**: Find all VoLTE or 5G SA capable devices
- Filter by provider to see certification status
- Export results for reporting and analysis

---

## 🚀 Features

### For Network Engineers & Device Testing Teams

- **Comprehensive Device Database**: 15+ devices with detailed capability data
- **Provider-Specific Views**: Toggle between global capabilities and carrier-specific certifications
- **Advanced Filtering**: Filter by technology, provider, and specific capabilities
- **Real-Time Search**: Instant results with debounced search and GraphQL caching
- **Flexible Data Display**: Choose which fields to show based on your needs

### For Telecom Professionals

- **Quick Answers**: Instantly answer customer questions about device compatibility
- **Certification Tracking**: See which devices are certified for specific bands on your network
- **Competitive Analysis**: Compare device support across various providers like 
Telus, Rogers, Bell, and Freedom Mobile
- **Software Tracking**: Monitor capability changes across OS versions

### Technology Highlights

- **GraphQL API**: Efficient, type-safe queries with no over-fetching
- **Type Safety**: End-to-end TypeScript from database to UI
- **Performance**: DataLoaders prevent N+1 queries, query complexity limits prevent abuse
- **Modern UI**: Responsive design with Tailwind CSS, accessible components
- **Developer Experience**: Hot reload, code generation, comprehensive type checking

---

## 📋 Prerequisites

To get started, ensure you have the following installed on your system:

- **Bun**: `1.x` or newer - [Install Bun](https://bun.sh)
- **PostgreSQL**: `16.x` or newer
- **Docker & Docker Compose** (for containerized development)

---

## 🔧 Environment Setup

### Backend Configuration

1. **Configure Backend Environment Variables**:

   Navigate to the backend package and copy the example environment file:
   ```bash
   cd packages/backend
   cp .env.example .env
   ```

2. **Edit Backend `.env`** with your database credentials:
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

   # GraphQL
   GRAPHQL_MAX_DEPTH=5
   GRAPHQL_MAX_COMPLEXITY=1000
   GRAPHQL_RATE_LIMIT_PER_MINUTE=100
   GRAPHQL_RATE_LIMIT_PER_HOUR=1000
   ```

### Frontend Configuration

1. **Configure Frontend Environment Variables**:

   Navigate to the frontend package and copy the example environment file:
   ```bash
   cd packages/frontend
   cp .env.example .env
   ```

2. **Edit Frontend `.env`**:
   ```bash
   # Backend API
   VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql

   # App Configuration
   VITE_APP_NAME=Device Capabilities
   VITE_APP_VERSION=1.0.0
   ```

### Security Notes

- Never commit your `.env` files to version control (they're already in `.gitignore`)
- For production, set environment variables through your hosting platform
- The `.env.example` files serve as documentation for required variables

---

## 🛠️ Standard Installation (Local Development)

### 1. Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/devxiongmao/device-query-tool.git
cd device-query-tool
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd packages/backend
bun install

# Install frontend dependencies
cd ../frontend
bun install
```

### 3. Setup the Database

Create and seed the database:

```bash
cd packages/backend

# Generate migration
bun run db:generate

# Apply migration
bun run db:migrate

# Seed with test data
bun run db:seed
```

### 4. Generate GraphQL Types (Frontend)

Generate TypeScript types from the GraphQL schema:

```bash
cd packages/frontend
bun run codegen
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd packages/backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd packages/frontend
bun run dev
```

**Terminal 3 - GraphQL Codegen Watch (Optional):**
```bash
cd packages/frontend
bun run codegen:watch
```

Visit the app in your browser:
- **Frontend**: http://localhost:5173
- **GraphQL Playground**: http://localhost:3000/graphql

---

## 🐳 Docker Setup (Recommended)

For a containerized development environment with all services orchestrated:

### 1. Clone the Repository

```bash
git clone https://github.com/devxiongmao/device-query-tool.git
cd device-query-tool
```

### 2. Start All Services

This will start PostgreSQL, backend, and frontend services:

```bash
make docker-up
```

The docker-compose setup will:
- Start PostgreSQL database on port 5432
- Start backend API on port 3000
- Start frontend dev server on port 5173
- Automatically run migrations and seed data
- Set up volume mounts for hot-reload development

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql

### 4. Stop All Services

When you're done working:

```bash
make docker-down
```

### Docker Make Commands Reference

| Command | Description |
|---------|-------------|
| `make docker-up` | Start all services (database, backend, frontend) |
| `make docker-down` | Stop all running containers |
| `make docker-logs` | View logs from all containers |
| `make docker-restart` | Restart all services |
| `make docker-clean` | Stop containers and remove volumes (fresh start) |

---

## 🧪 Testing

### Backend Tests

Run the backend test suite:

```bash
cd packages/backend
bun run test
```

### Frontend Tests

Run the frontend test suite:

```bash
cd packages/frontend
bun run test
```

### Run Quality Checks

Ensure your code adheres to style guidelines:

```bash
# Backend type checking
cd packages/backend
bun run typecheck

# Frontend type checking
cd packages/frontend
bun run typecheck
```

---

## 📚 Architecture & Technology Stack

### Backend

- **Hono**: Ultra-fast web framework for Bun/Node.js
- **Bun**: Lightning-fast JavaScript runtime and package manager
- **PostgreSQL**: Robust relational database for complex device relationships
- **Drizzle ORM**: Type-safe SQL query builder with excellent TypeScript support
- **GraphQL Yoga**: Modern GraphQL server with built-in performance features
- **Pothos**: Code-first GraphQL schema builder with excellent type inference

### GraphQL Features

- **DataLoaders**: Automatic batching and caching to prevent N+1 queries
- **Query Complexity Analysis**: Prevent expensive queries from overloading the server
- **Query Depth Limiting**: Maximum depth of 5 levels to prevent deeply nested queries
- **Rate Limiting**: 100 requests/minute, 1000 requests/hour per IP
- **Field-Level Permissions**: Granular control over data access

### Frontend

- **React**: Modern UI library with concurrent features
- **TypeScript**: Full type safety across the entire application
- **Vite**: Next-generation frontend tooling with instant HMR
- **Apollo Client**: Powerful GraphQL client with intelligent caching
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing with nested routes

### Code Generation

- **GraphQL Code Generator**: Automatic TypeScript type generation from schema
- **Type-Safe Hooks**: Generated React hooks with full IntelliSense support
- **Fragment Colocation**: Reusable GraphQL fragments for consistent queries

### Database Schema

Complex many-to-many relationships modeling:
- **Devices** ↔ **Software Versions** ↔ **Bands/Combos/Features**
- **Providers** → Certification restrictions on bands/combos
- **Software-Specific Capabilities**: Track changes across OS versions
- **Efficient Indexing**: Optimized composite indexes on junction tables

### Development Tools

- **Hot Module Replacement**: Instant updates during development
- **GraphiQL**: Interactive GraphQL playground for testing queries
- **Drizzle Studio**: Visual database browser and editor
- **Type Checking**: Continuous type validation across stack

---

## 📖 User Guide

### Query by Device Page

1. **Search for a Device**: Type vendor or model number (e.g., "Apple", "iPhone", "SM-S928W")
2. **Select Provider**: Choose between "Global" (all capabilities) or specific provider (Telus, Rogers, Bell, Freedom)
3. **Filter Technologies**: Check boxes for GSM, HSPA, LTE, or 5G NR
4. **Select Fields**: Choose which data to display (Software, Bands, Combos, Features)
5. **View Results**: See comprehensive capability breakdown

### Query by Capability Page

1. **Select Capability Type**: Choose Band, Combo, or Feature
2. **Search**: 
   - **Band**: Filter by technology and band number
   - **Combo**: Filter by technology and combo name
   - **Feature**: Search by feature name
3. **Filter by Provider**: Optional provider-specific filtering
4. **Display Options**: Toggle additional device information
5. **View Results**: Table of all matching devices with support status

### Example Queries

**"Does iPhone 15 Pro support n77 on Telus?"**
→ Query by Device → Select iPhone 15 Pro → Provider: Telus → Technology: 5G NR → View Bands

**"Which devices support VoLTE on Rogers?"**
→ Query by Capability → Feature → Search: VoLTE → Provider: Rogers

**"Show me all devices with EN-DC B2-n66 combo"**
→ Query by Capability → Combo → Technology: EN-DC → Search: B2-n66

---

## 🗄️ Database Schema

### Core Tables

- **DEVICE**: Device information (vendor, model, market name, release date)
- **SOFTWARE**: OS versions linked to devices (platform, build number, PTCRB, SVN)
- **BAND**: Frequency bands (band number, technology, frequency range, band class)
- **COMBO**: Carrier aggregation combos (name, technology)
- **FEATURE**: Device features (VoLTE, VoWiFi, 5G SA, etc.)
- **PROVIDER**: Telecom providers (name, country, network type)

### Junction Tables (Global Capabilities)

- **DEVICE_SOFTWARE_BAND**: Which bands each device/software supports globally
- **DEVICE_SOFTWARE_COMBO**: Which combos each device/software supports globally
- **COMBO_BAND**: Which bands make up each combo (with position)

### Junction Tables (Provider-Specific)

- **PROVIDER_DEVICE_SOFTWARE_BAND**: Provider-certified band support
- **PROVIDER_DEVICE_SOFTWARE_COMBO**: Provider-certified combo support
- **DEVICE_SOFTWARE_PROVIDER_FEATURE**: Feature support per provider

### Key Design Decisions

- **Software-Level Granularity**: Capabilities can change between OS versions
- **Provider Restrictions**: Global capability vs. provider certification tracking
- **Composite Primary Keys**: Efficient querying of many-to-many relationships
- **Strategic Indexing**: 10+ indexes optimized for common query patterns

---

## 🌟 Contributing

We welcome contributions to Device Capabilities! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes with proper tests
4. Ensure all tests pass (`bun test`)
5. Run type checking (`bun run type-check`)
6. Commit your changes (`git commit -m "Add your feature"`)
7. Push to the branch (`git push origin feature/your-feature`)
8. Open a pull request

### Areas Where We Need Help

- **Additional Carriers**: Support for US carriers (Verizon, AT&T, T-Mobile)
- **International Support**: Carriers from other countries
- **Bulk Import**: CSV/Excel import for device data
- **API Documentation**: Comprehensive GraphQL schema documentation

---

## 🛡️ License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgements

- The Bun team for creating an incredible runtime
- The GraphQL community for powerful API tooling
- Pothos GraphQL for the best schema-building experience
- Drizzle ORM team for excellent TypeScript-first database tools
- The React and TypeScript communities
- All contributors and early adopters
- Telecom professionals who provided domain expertise

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/devxiongmao/device-query-tool/issues)
- **Documentation**: [GitHub Wiki](https://github.com/devxiongmao/device-query-tool/wiki)

---

## 🚀 Get Started Today

Ready to streamline your device capability queries? 

**For Network Engineers**: Stop searching through spreadsheets  
**For Device Testers**: Instant certification status lookup  
**For Support Teams**: Answer customer questions in seconds  
**For Developers**: Extend the platform with the GraphQL API

Clone the repo and start querying! 📱💨

```bash
git clone https://github.com/your-username/device-capabilities.git
cd device-capabilities
make docker-up
# Visit http://localhost:5173
```

Happy Querying! 🎯✨