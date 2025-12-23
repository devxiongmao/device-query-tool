# Frontend - Device Capabilities Query Tool

The frontend package for the Device Capabilities Query Tool, a modern React application built with TypeScript, GraphQL, and Tailwind CSS. This package provides an intuitive user interface for querying device RF capabilities, bands, carrier aggregation combos, and network features.

## 🎯 Overview

This frontend application enables users to:

- **Query by Device**: Search for devices and view their comprehensive capability breakdowns
- **Query by Capability**: Find all devices supporting specific bands, combos, or features
- **Filter by Provider**: Toggle between global capabilities and provider-specific certifications
- **Real-time Search**: Instant results with debounced search and GraphQL caching

For the complete project overview, see the [main README](../../README.md).

---

## 🛠️ Technology Stack

### Core Framework

- **React 19**: Modern UI library with concurrent features
- **TypeScript 5.9**: Full type safety across the application
- **Vite 7**: Next-generation frontend tooling with instant HMR

### GraphQL & Data Fetching

- **Apollo Client 3.11**: Powerful GraphQL client with intelligent caching
- **GraphQL Code Generator**: Automatic TypeScript type generation from schema
- **Typed Document Node**: Type-safe GraphQL operations

### UI & Styling

- **Tailwind CSS 3**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **class-variance-authority**: Component variant management

### Forms & Validation

- **React Hook Form**: Performant form library
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form

### Routing

- **React Router 7**: Client-side routing with nested routes

### Testing

- **Vitest**: Fast unit test framework
- **Testing Library**: React component testing utilities
- **Happy DOM**: Lightweight DOM implementation for testing
- **Jest Axe**: Accessibility testing

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/        # Layout components (Layout, navigation)
│   └── ui/            # Base UI components (Button, Card, Table, etc.)
├── features/          # Feature-specific components
│   ├── capabilities/  # Capability query components
│   └── devices/       # Device query components
├── pages/             # Page components (routes)
│   ├── Home.tsx
│   ├── DeviceQuery.tsx
│   ├── CapabilityQuery.tsx
│   └── NotFound.tsx
├── graphql/           # GraphQL configuration and queries
│   ├── client.ts      # Apollo Client setup
│   ├── fragments/     # GraphQL fragments
│   ├── queries/       # GraphQL query files
│   └── generated/     # Auto-generated types (gitignored)
├── config/            # Configuration files
│   └── apollo.ts      # Apollo Client configuration
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions (cn, etc.)
├── routes/            # Route configuration
│   └── index.tsx      # React Router setup
├── App.tsx            # Root component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun**: `1.x` or newer - [Install Bun](https://bun.sh)
- **Backend Running**: The frontend requires the backend GraphQL API to be running

### Installation

1. **Install Dependencies**:

   ```bash
   cd packages/frontend
   bun install
   ```

2. **Configure Environment Variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```bash
   # Backend API
   VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql

   # App Configuration
   VITE_APP_NAME=Device Capabilities
   VITE_APP_VERSION=1.0.0
   ```

3. **Generate GraphQL Types**:

   ```bash
   bun run codegen
   ```

   This generates TypeScript types from the GraphQL schema. Make sure the backend is running before generating types.

4. **Start Development Server**:

   ```bash
   bun run dev
   ```

   The app will be available at http://localhost:5173

---

## 🔄 Development Workflow

### GraphQL Code Generation

The frontend uses GraphQL Code Generator to automatically generate TypeScript types and React hooks from your GraphQL schema and queries.

**Generate Types Once**:

```bash
bun run codegen
```

**Watch Mode** (recommended during development):

```bash
bun run codegen:watch
```

This watches for changes in GraphQL query files and automatically regenerates types.

**Generated Files**:

- `src/graphql/generated/graphql.ts`: TypeScript types and React hooks
- `src/graphql/generated/gql.ts`: Typed document nodes

**Usage Example**:

```typescript
import { useDevicesQuery } from "../graphql/generated/graphql";
import { devicesDocument } from "../graphql/generated/gql";

// Using generated hook
const { data, loading, error } = useDevicesQuery({
  variables: { vendor: "Apple" },
});

// Or using typed document node
const result = await apolloClient.query({
  query: devicesDocument,
  variables: { vendor: "Apple" },
});
```

### Writing GraphQL Queries

1. **Create Query File**: Add `.graphql` files in `src/graphql/queries/`
2. **Use Fragments**: Reuse fragments from `src/graphql/fragments/` for consistency
3. **Run Codegen**: Types are automatically generated
4. **Import Generated Hooks**: Use the generated hooks in your components

**Example Query File** (`device.queries.graphql`):

```graphql
query Devices($vendor: String, $modelNum: String) {
  devices(vendor: $vendor, modelNum: $modelNum) {
    ...DeviceFields
  }
}
```

### Hot Module Replacement

Vite provides instant HMR during development. Changes to components, styles, and most files will update immediately without a full page reload.

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test --watch

# Run tests with coverage
bun run test --coverage
```

### Test Structure

Tests are co-located with components:

- `tests/components/` - Component tests
- `tests/features/` - Feature-specific tests
- `tests/pages/` - Page component tests
- `tests/lib/` - Utility function tests

### Writing Tests

Example component test:

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Accessibility Testing

The project includes `jest-axe` for accessibility testing:

```typescript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

it("should have no accessibility violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🏗️ Building for Production

### Build

```bash
bun run build
```

This will:

1. Run TypeScript type checking (`tsc --noEmit`)
2. Build the production bundle with Vite
3. Output to `dist/` directory

### Preview Production Build

```bash
bun run preview
```

This serves the production build locally for testing.

### Type Checking

```bash
bun run typecheck
```

Runs TypeScript compiler in check mode without emitting files.

---

## 🎨 UI Components

### Base Components (`src/components/ui/`)

The project includes a set of reusable UI components built with Tailwind CSS and Radix UI:

- **Button**: Primary, secondary, and variant buttons
- **Card**: Container component for content sections
- **Table**: Data table with sorting and filtering
- **Input**: Text input with validation support
- **Select**: Dropdown select component
- **Checkbox**: Form checkbox component
- **Badge**: Status and label badges
- **Spinner**: Loading indicator
- **EmptyState**: Empty state placeholder

### Feature Components

- **Device Search**: Search and filter devices
- **Capability Search**: Search by bands, combos, or features
- **Provider Selector**: Toggle between providers
- **Technology Filter**: Filter by GSM/HSPA/LTE/5G NR
- **Field Selector**: Choose which data fields to display
- **Results Tables**: Display query results with sorting

---

## 🔌 Apollo Client Configuration

The Apollo Client is configured in `src/config/apollo.ts` with:

- **Error Handling**: GraphQL and network error handling
- **Caching Strategy**:
  - `cache-and-network` for watch queries (always fresh data)
  - `cache-first` for regular queries (optimize for speed)
- **Type Policies**: Custom cache policies for entities
- **Rate Limit Handling**: Automatic handling of rate limit errors

### Environment Variables

- `VITE_GRAPHQL_ENDPOINT`: Backend GraphQL endpoint (default: `http://localhost:3000/graphql`)

---

## 📝 Code Style & Linting

### ESLint

The project uses ESLint with TypeScript support:

```bash
bun run lint
```

### TypeScript Configuration

Multiple TypeScript configs for different contexts:

- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: Application code
- `tsconfig.node.json`: Node.js scripts (Vite config, etc.)
- `tsconfig.test.json`: Test files

---

## 🐳 Docker Development

When running in Docker, use the `docker` script:

```bash
bun run docker
```

This runs Vite with `--host` flag to allow external connections from Docker containers.

---

## 📚 Key Features

### Query by Device

- Search devices by vendor, model number, or market name
- Filter by provider (Global, Telus, Rogers, Bell, Freedom)
- Filter by technology (GSM, HSPA, LTE, 5G NR)
- Select which fields to display (Software, Bands, Combos, Features)
- Real-time search with debouncing

### Query by Capability

- Search by Band, Combo, or Feature
- Filter by technology and provider
- Display matching devices with support status
- Export results for reporting

### Responsive Design

- Mobile-first approach
- Accessible components with ARIA labels
- Keyboard navigation support

---

## 🔗 Related Documentation

- [Main README](../../README.md) - Complete project overview and setup
- [Backend README](../backend/README.md) - Backend API documentation
- [Development Plan](../../docs/Development_Plan_Device_Capabilities_Query_Tool.md) - Architecture and planning docs

---

## 🐛 Troubleshooting

### GraphQL Types Not Updating

1. Ensure backend is running
2. Run `bun run codegen` manually
3. Check `codegen.ts` configuration
4. Verify GraphQL endpoint in `.env`

### Build Errors

1. Run `bun run typecheck` to see TypeScript errors
2. Ensure all dependencies are installed: `bun install`
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Apollo Client Errors

1. Verify `VITE_GRAPHQL_ENDPOINT` in `.env`
2. Check backend is running and accessible
3. Check browser console for CORS errors

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
