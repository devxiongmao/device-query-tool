# Development Plan: Device Capabilities Query Tool

## 🎯 Slice 1: Foundation - Database & Backend Setup

**Goal:** Get the database schema implemented, seeded with test data, and basic Hono server running  

### **Tasks**

---

### **1. Project Setup**

- Initialize monorepo with pnpm workspaces  
- Set up backend package with Bun + Hono + TypeScript  
- Configure environment variables  

---

### **2. Database Setup**

- Choose database (**PostgreSQL recommended**)  
- Implement schema using Drizzle ORM or raw SQL  
- Create all tables from your ERD  

**Critical Indexes:**

```sql
-- Junction table composite indexes
CREATE INDEX idx_dsb_device_software ON DEVICE_SOFTWARE_BAND(device_id, software_id);
CREATE INDEX idx_dsb_band_lookup ON DEVICE_SOFTWARE_BAND(band_id);
CREATE INDEX idx_dsc_device_software ON DEVICE_SOFTWARE_COMBO(device_id, software_id);
CREATE INDEX idx_dsc_combo_lookup ON DEVICE_SOFTWARE_COMBO(combo_id);
CREATE INDEX idx_pdsb_provider_lookup ON PROVIDER_DEVICE_SOFTWARE_BAND(provider_id, band_id);
CREATE INDEX idx_pdsc_provider_lookup ON PROVIDER_DEVICE_SOFTWARE_COMBO(provider_id, combo_id);
CREATE INDEX idx_dspf_lookup ON DEVICE_SOFTWARE_PROVIDER_FEATURE(device_id, software_id, provider_id, feature_id);
CREATE INDEX idx_dspf_feature_lookup ON DEVICE_SOFTWARE_PROVIDER_FEATURE(feature_id);

-- Foreign key indexes
CREATE INDEX idx_software_device ON SOFTWARE(device_id);
```

---

### **3. Seed Data Script**

Create realistic test data covering:

- 10–15 devices (mix of vendors: Apple, Samsung, Google)  
- 3–5 software versions per device  
- 20+ bands (LTE, NR)  
- 10+ combos (LTE CA, EN-DC, NR CA)  
- 5+ features (VoLTE, VoWiFi, 5G SA, etc.)  
- 3–4 providers (Telus, Rogers, Bell, etc.)  
- Junction table entries showing various support scenarios  

---

### **4. Basic Hono Server**

- Set up Hono app  
- Add health check endpoint  
- Configure CORS  
- Add request logging middleware  

---

### **Deliverable**

- ✅ Database fully seeded with realistic test data  
- ✅ Hono server running on `localhost:3000`  
- ✅ Health check endpoint: `GET /health`  
- ✅ Can query database directly to verify data  

---

### **Testing**

```bash
# Verify database
bun run seed
psql -d device_capabilities -c "SELECT COUNT(*) FROM DEVICE;"

# Verify server
curl http://localhost:3000/health
```

---

## 🎯 Slice 2: GraphQL Schema & Query Engine

**Goal:** Implement complete GraphQL schema with all types, queries, and DataLoaders for efficient querying  

### **Tasks**

---

### **GraphQL Setup**

- Install GraphQL Yoga + Pothos  
- Configure schema builder  
- Set up GraphQL context with database access  

---

### **Type Definitions (all types from your schema)**

- **Device** type with all fields  
- **Software** type with relationships  
- **Band** type  
- **Combo** type with nested bands  
- **Feature** type  
- **Provider** type  
- Junction types: DeviceFeature, DeviceBand, etc.  

---

### **Repository Layer (data access)**

- `DeviceRepository` – findById, findByIds, search  
- `SoftwareRepository` – findByDevice, findById  
- `BandRepository` – findById, findByIds, findDevicesSupportingBand  
- `ComboRepository` – findById, findDevicesSupportingCombo  
- `FeatureRepository` – findById, findDevicesSupportingFeature  
- **Key method:** `findDevicesWithCapability(params)` — handles complex filtering  

---

### **DataLoader Implementation (prevent N+1 queries)**

- `deviceById` – batch load devices  
- `softwareByDevice` – batch load software for devices  
- `bandsByDeviceSoftware` – with optional provider filter  
- `combosByDeviceSoftware` – with optional provider filter  
- `featuresByDeviceSoftware` – with optional provider filter  
- `devicesByBand` – reverse lookup with filters  
- `devicesByCombo` – reverse lookup with filters  
- `devicesByFeature` – reverse lookup with filters  

---

### **Query Root – Device Page Queries**

```graphql
type Query {
  # Single device lookup
  device(id: ID!): Device

  # For autocomplete/search
  devices(
    vendor: String
    modelNum: String
    limit: Int
    offset: Int
  ): [Device!]!
}

type Device {
  id: ID!
  vendor: String!
  modelNum: String!
  marketName: String
  releaseDate: DateTime!

  # Global capabilities
  software: [Software!]!
  supportedBands(technology: String): [Band!]!
  supportedCombos(technology: String): [Combo!]!
  features: [Feature!]!

  # Provider-specific capabilities
  supportedBandsForProvider(providerId: ID!, technology: String): [Band!]!
  supportedCombosForProvider(providerId: ID!, technology: String): [Combo!]!
  featuresForProvider(providerId: ID!): [Feature!]!
}
```

---

### **Query Root – Capability Page Queries**

```graphql
type Query {
  # Band lookups
  band(id: ID!): Band
  bands(technology: String, bandNumber: String): [Band!]!

  # Combo lookups
  combo(id: ID!): Combo
  combos(technology: String, name: String): [Combo!]!

  # Feature lookups
  feature(id: ID!): Feature
  features(name: String): [Feature!]!

  # Provider lookup
  providers: [Provider!]!

  # Main capability search queries
  devicesByBand(
    bandId: ID!
    providerId: ID
    technology: String
  ): [DeviceCapabilityResult!]!

  devicesByCombo(
    comboId: ID!
    providerId: ID
    technology: String
  ): [DeviceCapabilityResult!]!

  devicesByFeature(
    featureId: ID!
    providerId: ID
  ): [DeviceCapabilityResult!]!
}

type DeviceCapabilityResult {
  device: Device!
  software: [Software!]!
  supportStatus: String! # "global" or "provider-specific"
  provider: Provider
}
```

---

### **Field Selection / Projection**

- Implement `@skip` and `@include` directive support (built into GraphQL)  
- Clients control returned fields via query structure  

---

### **Query Complexity & Rate Limiting**

- Add query depth limiting (**max depth: 5**)  
- Add query complexity analysis  
- Implement basic rate limiting  

---

### **Deliverable**

- ✅ GraphQL endpoint at `/graphql`  
- ✅ GraphiQL playground enabled  
- ✅ All queries working with test data  
- ✅ DataLoaders preventing N+1 queries  
- ✅ Query logging showing execution time  

---

### **Testing**

```graphql
# Test Device Page Query - Global Capabilities
query TestDeviceGlobal {
  device(id: "1") {
    vendor
    modelNum
    supportedBands(technology: "NR") {
      bandNumber
      frequencyRange
    }
    features {
      name
    }
  }
}

# Test Device Page Query - Provider-Specific
query TestDeviceProvider {
  device(id: "1") {
    vendor
    modelNum
    supportedBandsForProvider(providerId: "1", technology: "LTE") {
      bandNumber
    }
    featuresForProvider(providerId: "1") {
      name
    }
  }
}

# Test Capability Page Query - Band Global
query TestBandGlobal {
  devicesByBand(bandId: "5") {
    device {
      vendor
      modelNum
    }
    software {
      buildNumber
    }
    supportStatus
  }
}

# Test Capability Page Query - Band Provider-Specific
query TestBandProvider {
  devicesByBand(bandId: "5", providerId: "1") {
    device {
      vendor
      modelNum
    }
    supportStatus
    provider {
      name
    }
  }
}
```

---

## 🎯 Slice 3: Frontend Foundation & Device Query Page

**Goal:** Set up React app with routing, Apollo Client, and complete Device Query page  

### **Tasks**

---

### **Frontend Project Setup**

- Initialize Vite + React + TypeScript  
- Configure Tailwind CSS  
- Set up React Router  
- Install Apollo Client  

---

### **Apollo Client Configuration**

```typescript
// src/config/apollo.ts
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

---

### **GraphQL Code Generator Setup**

- Configure `codegen.ts`  
- Generate TypeScript types from schema  
- Generate React hooks  
- Add dev workflow: `pnpm run codegen:watch`  

---

### **UI Component Library**

Install shadcn/ui or build components:

- Input  
- Select  
- Button  
- Card  
- Badge  
- Table  
- Checkbox  

Create **Layout** component with navigation  

---

### **Device Query Page – Components**

#### a. **Device Search/Autocomplete**

```typescript
// features/devices/components/DeviceSearch.tsx
```

- Searchable dropdown  
- Shows vendor + model number + market name  
- Debounced search (300ms)  
- Uses `devices(vendor: $search, limit: 10)`  

#### b. **Provider Selector**

```typescript
// features/devices/components/ProviderSelector.tsx
```

- Radio buttons or tabs  
- Options: "Global Capabilities" or provider  
- Loads provider list on mount  

#### c. **Technology Filter**

```typescript
// features/devices/components/TechnologyFilter.tsx
```

- Checkboxes: GSM, HSPA, LTE, NR  

#### d. **Field Selector**

```typescript
// features/devices/components/FieldSelector.tsx
```

- Checkboxes for:  
  - Software  
  - Bands  
  - Combos  
  - Features  

#### e. **Results Display**

```typescript
// features/devices/components/DeviceResults.tsx
```

- Device header  
- Tabs: Software, Bands, Combos, Features  
- Conditional rendering based on field selector  

---

### **Device Page – State Management**

```typescript
// features/devices/hooks/useDeviceQuery.ts
```

- Manages selected device, provider, tech filters, field selection  
- Builds dynamic GraphQL query  

---

### **Dynamic GraphQL Query Construction**

```typescript
const query = useMemo(() => {
  let fields = `
    id
    vendor
    modelNum
    marketName
    releaseDate
  `;

  if (selectedFields.includes('software')) {
    fields += `software { id name buildNumber }`;
  }

  if (selectedFields.includes('bands')) {
    if (providerId) {
      fields += `supportedBandsForProvider(providerId: $providerId) {
        bandNumber technology frequencyRange
      }`;
    } else {
      fields += `supportedBands { bandNumber technology frequencyRange }`;
    }
  }

  return gql`query GetDevice($id: ID!, $providerId: ID) {
    device(id: $id) { ${fields} }
  }`;
}, [selectedFields, providerId]);
```

---

### **Routing Setup**

```typescript
// src/routes/index.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/device" element={<DeviceQueryPage />} />
  <Route path="/capability" element={<CapabilityQueryPage />} />
</Routes>
```

---

### **Deliverable**

- ✅ React app on `localhost:5173`  
- ✅ Device Query page functional  
- ✅ Search, provider toggle, tech filter, field selector  
- ✅ Data displays correctly  
- ✅ Good loading & error states  

---

### **Testing**

- Search “iPhone”, select device  
- View global capabilities  
- Switch to provider-specific (Telus)  
- Filter to NR  
- Deselect “Combos” → verify not fetched  
- Check Network tab → only selected fields returned  

---

## 🎯 Slice 4: Capability Query Page

**Goal:** Implement the second page for querying by RF capability (bands/combos/features)  

### **Tasks**

---

### **Capability Query Page – Components**

#### a. Capability Type Selector

```typescript
// features/capabilities/components/CapabilityTypeSelector.tsx
```

- Tabs: Band | Combo | Feature  

#### b. Band Search Component

```typescript
// features/capabilities/components/BandSearch.tsx
```

- Technology selector  
- Band number input/dropdown  
- Shows band details  

#### c. Combo Search Component

```typescript
// features/capabilities/components/ComboSearch.tsx
```

- Tech selector  
- Combo dropdown  
- Shows combo name + component bands  

#### d. Feature Search Component

```typescript
// features/capabilities/components/FeatureSearch.tsx
```

- Dropdown of features  

#### e. Provider Filter

Reusing Component from Device Page  

#### f. Field Selector

```typescript
// features/capabilities/components/DeviceFieldSelector.tsx
```

- Checkboxes for optional fields  

#### g. Results Table

```typescript
// features/capabilities/components/CapabilityResults.tsx
```

- Vendor, model, market name, software, support status, provider  
- Expandable rows  
- Export to CSV  

---

### **State Management**

```typescript
// features/capabilities/hooks/useCapabilityQuery.ts
```

- Manages capability type, provider, fields, tech filter  
- Builds appropriate GraphQL query  

---

### **Query Strategy**

```typescript
// Band Query
const { data } = useQuery(DEVICES_BY_BAND, {
  variables: {
    bandId: selectedBand.id,
    providerId: selectedProvider?.id,
    technology: technologyFilter,
  },
  skip: !selectedBand,
});
```

(Plus similar for combos & features)

---

### **Deliverable**

- ✅ Capability Query page fully functional  
- ✅ Band / Combo / Feature queries  
- ✅ Results grouped by device  
- ✅ Global vs provider-specific clear  
- ✅ CSV export  

---

### **Testing**

**Test Case 1: Band Query – Global**

- Band = n77, Provider = All  
- Expect all global devices  

**Test Case 2: Band Query – Provider-Specific**

- Band = n77, Provider = Telus  
- Expect only Telus-supported devices  

**Test Case 3: Feature Query**

- Feature = VoLTE  
- Provider = Rogers  

**Test Case 4: Field Selection**

- Deselect fields  
- Network tab verifies excluded fields  

---

## 🎯 Slice 5: Polish, Performance & Deployment

**Goal:** Production-ready features, optimization, deployment pipeline  

### **Tasks**

---

### **Performance Optimization**

- Redis caching for DataLoaders  
- Query result caching  
- Pagination  
- Optimize DB queries (`EXPLAIN ANALYZE`)  
- DB connection pooling  

---

### **UI/UX Enhancements**

- Loading skeletons  
- Error boundaries  
- Empty states  
- Mobile responsiveness  
- Keyboard shortcuts  
- Dark mode  

---

### **Additional Features**

- Recent searches  
- Shareable URLs  
- Comparison view  
- Advanced filters  
- Bulk operations  

---

### **Testing**

- Unit tests  
- Integration tests  
- E2E tests  
- Query complexity tests  
- Load testing  

---

### **Documentation**

- API docs  
- User guide  
- Schema docs  
- Deployment guide  

---

### **DevOps**

- Docker Compose  
- Separate Dockerfiles  
- CI/CD (GitHub Actions)  
- Environment configs  
- Migration strategy  
- Monitoring/logging  

---

### **Deliverable**

- ✅ Production-ready app  
- ✅ Full test coverage  
- ✅ Docker deployment  
- ✅ CI/CD  
- ✅ Documentation  
- ✅ Performance benchmarks  

---

## 📊 Timeline Estimate

| Slice | Complexity | Estimated Time | Dependencies |
|-------|------------|----------------|--------------|
| Slice 1 | Low | 2-3 days | None |
| Slice 2 | High | 4-5 days | Slice 1 |
| Slice 3 | Medium | 3-4 days | Slice 2 |
| Slice 4 | Medium | 3-4 days | Slice 3 |
| Slice 5 | Medium | 3-5 days | Slice 4 |

**Total: ~3–4 weeks (full time)**

---

## 🎯 Success Criteria

### **Slice 1 ✓**

- [ ] Can seed database with 1 command  
- [ ] Database has realistic test data  
- [ ] Health check endpoint responds  

### **Slice 2 ✓**

- [ ] All GraphQL queries return correct data  
- [ ] No N+1 queries  
- [ ] Query complexity limits work  
- [ ] GraphiQL usable  

### **Slice 3 ✓**

- [ ] Device page loads < 2s  
- [ ] Provider filtering works  
- [ ] Field selector affects query & display  
- [ ] No console errors  

### **Slice 4 ✓**

- [ ] All 3 capability types work  
- [ ] Provider filter affects results  
- [ ] Global vs provider-specific clear  
- [ ] Results table readable  

### **Slice 5 ✓**

- [ ] Load time < 1s with caching  
- [ ] All tests pass  
- [ ] Deployable with 1 command  
- [ ] Works on mobile  
