device-capabilities/
├── packages/
│ ├── backend/ # Hono + GraphQL server
│ │ ├── src/
│ │ │ ├── index.ts # Server entry point
│ │ │ ├── app.ts # Hono app setup
│ │ │ │
│ │ │ ├── config/
│ │ │ │ ├── database.ts # DB connection config
│ │ │ │ └── env.ts # Environment variables
│ │ │ │
│ │ │ ├── db/
│ │ │ │ ├── schema.ts # Drizzle/Kysely schema definitions
│ │ │ │ ├── migrations/ # Database migrations
│ │ │ │ │ ├── 001_initial.sql
│ │ │ │ │ └── 002_add_indexes.sql
│ │ │ │ └── client.ts # DB client instance
│ │ │ │
│ │ │ ├── graphql/
│ │ │ │ ├── schema/
│ │ │ │ │ ├── index.ts # Schema builder setup
│ │ │ │ │ ├── types/ # GraphQL type definitions
│ │ │ │ │ │ ├── device.ts
│ │ │ │ │ │ ├── software.ts
│ │ │ │ │ │ ├── band.ts
│ │ │ │ │ │ ├── combo.ts
│ │ │ │ │ │ ├── feature.ts
│ │ │ │ │ │ ├── provider.ts
│ │ │ │ │ │ └── scalars.ts
│ │ │ │ │ ├── queries/ # Query resolvers
│ │ │ │ │ │ ├── device.ts
│ │ │ │ │ │ ├── band.ts
│ │ │ │ │ │ ├── feature.ts
│ │ │ │ │ │ └── search.ts
│ │ │ │ │ └── mutations/ # Future: mutations for data updates
│ │ │ │ │ └── device.ts
│ │ │ │ │
│ │ │ │ ├── context.ts # GraphQL context type & factory
│ │ │ │ ├── loaders.ts # DataLoader definitions
│ │ │ │ └── yoga.ts # GraphQL Yoga setup
│ │ │ │
│ │ │ ├── services/ # Business logic layer
│ │ │ │ ├── device.service.ts
│ │ │ │ ├── band.service.ts
│ │ │ │ ├── feature.service.ts
│ │ │ │ └── search.service.ts
│ │ │ │
│ │ │ ├── repositories/ # Data access layer
│ │ │ │ ├── device.repository.ts
│ │ │ │ ├── software.repository.ts
│ │ │ │ ├── band.repository.ts
│ │ │ │ ├── combo.repository.ts
│ │ │ │ ├── feature.repository.ts
│ │ │ │ └── provider.repository.ts
│ │ │ │
│ │ │ ├── middleware/
│ │ │ │ ├── cors.ts
│ │ │ │ ├── logger.ts
│ │ │ │ ├── error-handler.ts
│ │ │ │ └── auth.ts # Future: authentication
│ │ │ │
│ │ │ ├── utils/
│ │ │ │ ├── logger.ts
│ │ │ │ ├── cache.ts # Redis cache utilities
│ │ │ │ └── query-complexity.ts # GraphQL query complexity analysis
│ │ │ │
│ │ │ └── types/
│ │ │ ├── database.ts # DB types
│ │ │ └── context.ts # Shared types
│ │ │
│ │ ├── tests/
│ │ │ ├── integration/
│ │ │ │ ├── device.test.ts
│ │ │ │ └── band.test.ts
│ │ │ └── unit/
│ │ │ ├── services/
│ │ │ └── repositories/
│ │ │
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── .env.example
│ │
│ ├── frontend/ # React application
│ │ ├── src/
│ │ │ ├── main.tsx # Entry point
│ │ │ ├── App.tsx
│ │ │ │
│ │ │ ├── config/
│ │ │ │ └── apollo.ts # Apollo Client setup
│ │ │ │
│ │ │ ├── graphql/
│ │ │ │ ├── queries/ # GraphQL queries
│ │ │ │ │ ├── device.queries.ts
│ │ │ │ │ ├── band.queries.ts
│ │ │ │ │ ├── feature.queries.ts
│ │ │ │ │ └── search.queries.ts
│ │ │ │ │
│ │ │ │ ├── fragments/ # Reusable GraphQL fragments
│ │ │ │ │ ├── device.fragments.ts
│ │ │ │ │ ├── software.fragments.ts
│ │ │ │ │ └── band.fragments.ts
│ │ │ │ │
│ │ │ │ └── generated/ # GraphQL Code Generator output
│ │ │ │ ├── graphql.ts # Generated types & hooks
│ │ │ │ └── schema.json
│ │ │ │
│ │ │ ├── components/
│ │ │ │ ├── ui/ # Reusable UI components
│ │ │ │ │ ├── Button.tsx
│ │ │ │ │ ├── Card.tsx
│ │ │ │ │ ├── Input.tsx
│ │ │ │ │ ├── Select.tsx
│ │ │ │ │ ├── Table.tsx
│ │ │ │ │ └── Badge.tsx
│ │ │ │ │
│ │ │ │ ├── layout/
│ │ │ │ │ ├── Header.tsx
│ │ │ │ │ ├── Navigation.tsx
│ │ │ │ │ ├── Footer.tsx
│ │ │ │ │ └── Layout.tsx
│ │ │ │ │
│ │ │ │ └── shared/ # Shared business components
│ │ │ │ ├── DeviceCard.tsx
│ │ │ │ ├── BandBadge.tsx
│ │ │ │ ├── FeatureList.tsx
│ │ │ │ └── LoadingSpinner.tsx
│ │ │ │
│ │ │ ├── features/ # Feature-based organization
│ │ │ │ ├── devices/
│ │ │ │ │ ├── components/
│ │ │ │ │ │ ├── DeviceList.tsx
│ │ │ │ │ │ ├── DeviceDetail.tsx
│ │ │ │ │ │ ├── DeviceFilters.tsx
│ │ │ │ │ │ └── DeviceComparison.tsx
│ │ │ │ │ ├── hooks/
│ │ │ │ │ │ ├── useDeviceQuery.ts
│ │ │ │ │ │ └── useDeviceFilters.ts
│ │ │ │ │ └── types.ts
│ │ │ │ │
│ │ │ │ ├── bands/
│ │ │ │ │ ├── components/
│ │ │ │ │ │ ├── BandList.tsx
│ │ │ │ │ │ ├── BandDetail.tsx
│ │ │ │ │ │ └── BandCompatibility.tsx
│ │ │ │ │ └── hooks/
│ │ │ │ │ └── useBandQuery.ts
│ │ │ │ │
│ │ │ │ ├── features/
│ │ │ │ │ ├── components/
│ │ │ │ │ │ ├── FeatureList.tsx
│ │ │ │ │ │ ├── FeatureDetail.tsx
│ │ │ │ │ │ └── FeatureAvailability.tsx
│ │ │ │ │ └── hooks/
│ │ │ │ │ └── useFeatureQuery.ts
│ │ │ │ │
│ │ │ │ └── search/
│ │ │ │ ├── components/
│ │ │ │ │ ├── AdvancedSearch.tsx
│ │ │ │ │ ├── SearchFilters.tsx
│ │ │ │ │ ├── SearchResults.tsx
│ │ │ │ │ └── SavedSearches.tsx
│ │ │ │ ├── hooks/
│ │ │ │ │ ├── useCapabilitySearch.ts
│ │ │ │ │ └── useSearchState.ts
│ │ │ │ └── types.ts
│ │ │ │
│ │ │ ├── hooks/ # Global hooks
│ │ │ │ ├── useDebounce.ts
│ │ │ │ ├── useLocalStorage.ts
│ │ │ │ └── useMediaQuery.ts
│ │ │ │
│ │ │ ├── pages/ # Route pages
│ │ │ │ ├── Home.tsx
│ │ │ │ ├── DevicePage.tsx
│ │ │ │ ├── BandPage.tsx
│ │ │ │ ├── FeaturePage.tsx
│ │ │ │ ├── SearchPage.tsx
│ │ │ │ └── NotFound.tsx
│ │ │ │
│ │ │ ├── routes/
│ │ │ │ └── index.tsx # React Router setup
│ │ │ │
│ │ │ ├── utils/
│ │ │ │ ├── formatters.ts # Date, number formatting
│ │ │ │ ├── validators.ts
│ │ │ │ └── constants.ts
│ │ │ │
│ │ │ ├── styles/
│ │ │ │ ├── globals.css
│ │ │ │ └── tailwind.css
│ │ │ │
│ │ │ └── types/
│ │ │ └── index.ts # Shared frontend types
│ │ │
│ │ ├── public/
│ │ │ ├── favicon.ico
│ │ │ └── assets/
│ │ │
│ │ ├── tests/
│ │ │ ├── e2e/
│ │ │ │ └── device-search.spec.ts
│ │ │ └── components/
│ │ │ └── DeviceCard.test.tsx
│ │ │
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ ├── vite.config.ts
│ │ ├── tailwind.config.js
│ │ ├── codegen.ts # GraphQL Code Generator config
│ │ └── .env.example
│ │
│ └── shared/ # Shared types/utilities (optional)
│ ├── src/
│ │ ├── types/
│ │ │ └── common.ts
│ │ └── constants/
│ │ └── technologies.ts
│ ├── package.json
│ └── tsconfig.json
│
├── .github/
│ └── workflows/
│ ├── ci.yml
│ └── deploy.yml
│
├── docker/
│ ├── Dockerfile.backend
│ ├── Dockerfile.frontend
│ └── docker-compose.yml
│
├── docs/
│ ├── c4-architecture-diagrams/
│ │ ├── c1_context.mermaid
│ │ ├── c2_containers.mermaid
│ │ └── c3_components.mermaid
│ ├── user-journeys/
│ │ └── user-querying-devices.md
│ ├── erd.mermaid
│ └── file-structure.md
│
├── scripts/
│ ├── seed-database.ts
│ ├── generate-types.ts
│ └── migrate.ts
│
├── .gitignore
├── package.json # Root package.json for workspace
└── README.md
