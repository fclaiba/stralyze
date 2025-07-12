# DOCUMENTO DE FLUJOGRAMA Y ARQUITECTURA DEL SOFTWARE - STRALYZE

## 1. ARQUITECTURA GENERAL DEL SISTEMA

### 1.1 Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                        STRALYZE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   FRONTEND      │    │   BACKEND       │◄──►│   DATABASE   │ │
│  │   (Next.js 15)  │    │    Actions)     │    │  (Supabase   │ │
│  │                 │    │                 │    │  PostgreSQL) │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           ▼                       ▼                       ▼     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   COMPONENTS    │    │   MIDDLEWARE    │    │   AUTH       │ │
│  │   (React)       │    │   (Next.js)     │    │  (Supabase)  │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico Detallado

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND LAYER:                                                │
│  ├── Next.js 15 (App Router)                                   │
│  ├── React 19                                                  │
│  ├── TypeScript 5                                              │
│  ├── Tailwind CSS 3.4                                          │
│  ├── Radix UI + shadcn/ui                                      │
│  ├── Framer Motion                                             │
│  ├── React Hook Form + Zod                                     │
│  ├── Recharts                                                  │
│  └── TipTap (Rich Text Editor)                                 │
│                                                                 │
│  BACKEND LAYER:                                                 │
│  ├── Next.js Server Actions                                    │
│  ├── Next.js API Routes                                        │
│  ├── Next.js Middleware                                        │
│  └── Supabase Client/Server                                    │
│                                                                 │
│  DATABASE LAYER:                                                │
│  ├── Supabase (PostgreSQL)                                     │
│  ├── Row Level Security (RLS)                                  │
│  └── Real-time Subscriptions                                   │
│                                                                 │
│  INFRASTRUCTURE:                                                │
│  ├── Vercel (Deployment)                                       │
│  ├── Supabase (Hosting)                                        │
│  └── pnpm (Package Manager)                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. ARQUITECTURA DE CAPAS

### 2.1 Capa de Presentación (Frontend)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   PAGES         │    │   COMPONENTS    │    │   PROVIDERS  │ │
│  │                 │    │                 │    │              │ │
│  │ ├── Landing     │    │ ├── UI          │    │ ├── Auth     │ │
│  │ ├── Admin       │    │ ├── Dashboard   │    │ ├── Theme    │ │
│  │ ├── Email       │    │ ├── Email       │    │ └── Toast    │ │
│  │ └── Auth        │    │ └── Political   │    │              │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           ▼                       ▼                       ▼     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    HOOKS & UTILITIES                        │ │
│  │  ├── useAuth()                                              │ │
│  │  ├── useToast()                                             │ │
│  │  ├── useMobile()                                            │ │
│  │  └── Custom Hooks                                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Capa de Lógica de Negocio (Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   ACTIONS       │    │   API ROUTES    │    │  MIDDLEWARE  │ │
│  │                 │    │                 │    │              │ │
│  │ ├── Clients     │    │ ├── Auth        │    │ ├── Auth     │ │
│  │ ├── Email       │    │ ├── Clients     │    │ ├── CORS     │ │
│  │ ├── Templates   │    │ └── Webhooks    │    │ └── Logging  │ │
│  │ └── Tracking    │    │                 │    │              │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           ▼                       ▼                       ▼     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    DATA ACCESS LAYER                        │ │
│  │  ├── lib/data/clients.ts                                    │ │
│  │  ├── lib/data/email-marketing.ts                            │ │
│  │  ├── lib/data/users.ts                                      │ │
│  │  └── lib/data/forms.ts                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Capa de Datos (Database)

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   SUPABASE      │    │   TABLES        │    │   POLICIES   │ │
│  │   CLIENT        │    │                 │    │              │ │
│  │                 │    │ ├── clients     │    │ ├── RLS      │ │
│  │ ├── Browser     │    │ ├── users       │    │ ├── Auth     │ │
│  │ ├── Server      │    │ ├── campaigns   │    │ └── Access   │ │
│  │ └── Service     │    │ ├── templates   │    │              │ │
│  │                 │    │ ├── tracking    │    │              │ │
│  │                 │    │ └── activities  │    │              │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           ▼                       ▼                       ▼     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    POSTGRESQL DATABASE                      │ │
│  │  ├── Row Level Security (RLS)                               │ │
│  │  ├── Real-time Subscriptions                                │ │
│  │  ├── Triggers & Functions                                   │ │
│  │  └── Backup & Recovery                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3. FLUJOGRAMA DE FUNCIONAMIENTO

### 3.1 Flujo de Autenticación

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │  MIDDLEWARE │    │  SUPABASE   │    │   AUTH      │
│  ACCESS     │───►│  CHECK      │───►│   AUTH      │───►│  PROVIDER   │
│  /admin     │    │  SESSION    │    │  VALIDATE   │    │  UPDATE     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  REDIRECT   │    │  NO SESSION │    │  SESSION    │    │  UI UPDATE  │
│  TO LOGIN   │    │  FOUND      │    │  VALID      │    │  STATE      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  LOGIN      │    │  REDIRECT   │    │  ALLOW      │    │  DASHBOARD  │
│  FORM       │    │  TO LOGIN   │    │  ACCESS     │    │  RENDER     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 3.2 Flujo de Gestión de Clientes

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │  COMPONENT  │    │  SERVER     │    │  DATABASE   │
│  INTERFACE  │───►│  VALIDATION │───►│  ACTION     │───►│  OPERATION  │
│  INPUT      │    │  (Zod)      │    │  (CRUD)     │    │  (Supabase) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  FORM       │    │  VALIDATION │    │  DATA       │    │  PERSIST    │
│  SUBMIT     │    │  RESULT     │    │  PROCESSING │    │  CHANGES    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  SUCCESS    │    │  ERROR      │    │  REVALIDATE │    │  REAL-TIME  │
│  FEEDBACK   │    │  HANDLING   │    │  CACHE      │    │  UPDATE     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 3.3 Flujo de Email Marketing

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │  TEMPLATE   │    │  CAMPAIGN   │    │  SCHEDULING │
│  CREATES    │───►│  SELECTION  │───►│  CONFIG     │───►│  SYSTEM     │
│  CAMPAIGN   │    │  (Segment)  │    │  (Form)     │    │  (Cron)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  VALIDATION │    │  CONTENT    │    │  RECIPIENT  │    │  SEND       │
│  (Zod)      │    │  EDITOR     │    │  SEGMENT    │    │  EMAILS     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  SAVE       │    │  RICH TEXT  │    │  FILTER     │    │  TRACKING   │
│  TEMPLATE   │    │  (TipTap)   │    │  CLIENTS    │    │  (Opens)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ANALYTICS  │    │  PREVIEW    │    │  BATCH      │    │  CLICKS     │
│  DASHBOARD  │    │  MODE       │    │  PROCESSING │    │  TRACKING   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 4. ARQUITECTURA DE COMPONENTES

### 4.1 Jerarquía de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RootLayout                                                     │
│  ├── AuthProvider                                              │
│  │   └── Toaster                                              │
│  └── Children                                                  │
│                                                                 │
│  Page (Landing)                                                │
│  ├── Header                                                    │
│  ├── HeroWithCanvasReveal                                     │
│  ├── FeatureSection                                           │
│  ├── CompanyPresentation                                      │
│  ├── ServicesSection                                          │
│  ├── CaseStudies                                              │
│  ├── TestimonialsSection                                      │
│  ├── CTASection                                               │
│  └── Footer                                                   │
│                                                                 │
│  AdminLayout                                                   │
│  ├── Sidebar                                                  │
│  │   ├── Navigation                                           │
│  │   └── LogoutButton                                         │
│  └── MainContent                                              │
│      ├── Dashboard                                            │
│      │   ├── MetricsCards                                     │
│      │   ├── TimeSeriesGraph                                  │
│      │   └── ClientList                                       │
│      └── EmailMarketing                                       │
│          ├── CampaignsPage                                    │
│          ├── TemplatesPage                                    │
│          └── AnalyticsPage                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Patrones de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT PATTERNS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRESENTATIONAL COMPONENTS:                                     │
│  ├── Button, Card, Input, Select                               │
│  ├── Badge, Dialog, Toast                                      │
│  └── Reusable UI elements                                      │
│                                                                 │
│  CONTAINER COMPONENTS:                                          │
│  ├── Dashboard, CampaignForm                                   │
│  ├── ClientList, Analytics                                     │
│  └── Business logic containers                                 │
│                                                                 │
│  LAYOUT COMPONENTS:                                             │
│  ├── RootLayout, AdminLayout                                   │
│  ├── Sidebar, Header, Footer                                   │
│  └── Page structure components                                 │
│                                                                 │
│  PROVIDER COMPONENTS:                                           │
│  ├── AuthProvider, ThemeProvider                               │
│  ├── ToastProvider                                             │
│  └── Context providers                                         │
│                                                                 │
│  CUSTOM HOOKS:                                                  │
│  ├── useAuth, useToast                                         │
│  ├── useClientData, useCampaigns                               │
│  └── Reusable logic hooks                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 5. ARQUITECTURA DE DATOS

### 5.1 Modelo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA MODEL                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT ENTITY:                                                 │
│  ├── id: UUID (Primary Key)                                    │
│  ├── company: string                                           │
│  ├── status: enum (New Lead, In Process, Closed Deal, Abandoned)│
│  ├── industry: string                                          │
│  ├── contact: string                                           │
│  ├── email: string (Unique)                                    │
│  ├── phone: string                                             │
│  ├── paymentMethod: string                                     │
│  ├── contractStatus: enum                                      │
│  ├── deposit: decimal                                          │
│  ├── finalPayment: decimal                                     │
│  ├── totalAmount: decimal                                      │
│  ├── services: string[]                                        │
│  ├── budget: string                                            │
│  ├── createdAt: timestamp                                      │
│  └── updatedAt: timestamp                                      │
│                                                                 │
│  EMAIL_TEMPLATE ENTITY:                                         │
│  ├── id: UUID (Primary Key)                                    │
│  ├── name: string                                              │
│  ├── subject: string                                           │
│  ├── content: text                                             │
│  ├── segment: enum                                             │
│  ├── createdAt: timestamp                                      │
│  └── updatedAt: timestamp                                      │
│                                                                 │
│  EMAIL_CAMPAIGN ENTITY:                                         │
│  ├── id: UUID (Primary Key)                                    │
│  ├── name: string                                              │
│  ├── template_id: UUID (Foreign Key)                           │
│  ├── segment: enum                                             │
│  ├── status: enum                                              │
│  ├── scheduled_at: timestamp                                   │
│  ├── sent_at: timestamp                                        │
│  ├── createdAt: timestamp                                      │
│  └── updatedAt: timestamp                                      │
│                                                                 │
│  EMAIL_TRACKING ENTITY:                                         │
│  ├── id: UUID (Primary Key)                                    │
│  ├── campaign_id: UUID (Foreign Key)                           │
│  ├── client_id: UUID (Foreign Key)                             │
│  ├── email: string                                             │
│  ├── status: enum                                              │
│  ├── sent_at: timestamp                                        │
│  ├── delivered_at: timestamp                                   │
│  ├── opened_at: timestamp                                      │
│  ├── clicked_at: timestamp                                     │
│  ├── bounce_reason: string                                     │
│  ├── tracking_id: string (Unique)                              │
│  ├── createdAt: timestamp                                      │
│  └── updatedAt: timestamp                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Relaciones de Base de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  clients (1) ──── (N) email_tracking                           │
│       │                                                         │
│       │                                                         │
│       └─── (1) ──── (N) activities                            │
│                                                                 │
│  email_templates (1) ──── (N) email_campaigns                  │
│       │                                                         │
│       │                                                         │
│       └─── (1) ──── (N) email_tracking                         │
│                                                                 │
│  email_campaigns (1) ──── (N) email_tracking                   │
│       │                                                         │
│       │                                                         │
│       └─── (1) ──── (N) email_clicks                           │
│                                                                 │
│  users (1) ──── (N) activities                                 │
│                                                                 │
│  forms (1) ──── (1) clients                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 6. ARQUITECTURA DE SEGURIDAD

### 6.1 Capas de Seguridad

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND SECURITY:                                             │
│  ├── Input Validation (Zod)                                    │
│  ├── XSS Prevention                                            │
│  ├── CSRF Protection                                           │
│  └── Content Security Policy                                   │
│                                                                 │
│  MIDDLEWARE SECURITY:                                           │
│  ├── Authentication Check                                      │
│  ├── Route Protection                                          │
│  ├── Session Validation                                        │
│  └── Rate Limiting                                             │
│                                                                 │
│  BACKEND SECURITY:                                              │
│  ├── Server Actions Validation                                 │
│  ├── API Route Protection                                      │
│  ├── Environment Variables                                     │
│  └── Error Handling                                            │
│                                                                 │
│  DATABASE SECURITY:                                             │
│  ├── Row Level Security (RLS)                                  │
│  ├── Prepared Statements                                       │
│  ├── Connection Encryption                                     │
│  └── Backup & Recovery                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Flujo de Autenticación Seguro

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CLIENT    │    │  MIDDLEWARE │    │  SUPABASE   │    │  DATABASE   │
│  REQUEST    │───►│  VALIDATE   │───►│  AUTH       │───►│  RLS CHECK  │
│  (Token)    │    │  TOKEN      │    │  VERIFY     │    │  (Policy)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  VALID      │    │  ALLOW      │    │  SESSION    │    │  GRANT      │
│  TOKEN      │    │  REQUEST    │    │  VALID      │    │  ACCESS     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  PROCEED    │    │  ROUTE      │    │  USER       │    │  DATA       │
│  TO APP     │    │  ACCESS     │    │  CONTEXT    │    │  RETURN     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 7. ARQUITECTURA DE PERFORMANCE

### 7.1 Optimizaciones Implementadas

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND OPTIMIZATIONS:                                        │
│  ├── Lazy Loading (React.lazy)                                 │
│  ├── Code Splitting (Next.js)                                  │
│  ├── Memoization (useMemo, useCallback)                        │
│  ├── React.memo for Components                                 │
│  └── Image Optimization                                         │
│                                                                 │
│  BACKEND OPTIMIZATIONS:                                         │
│  ├── Server Actions (Reduced API calls)                        │
│  ├── Caching (Next.js Cache)                                   │
│  ├── Revalidation (revalidatePath)                             │
│  └── Streaming (Suspense)                                       │
│                                                                 │
│  DATABASE OPTIMIZATIONS:                                        │
│  ├── Indexes on frequently queried columns                     │
│  ├── Connection Pooling                                        │
│  ├── Query Optimization                                        │
│  └── Real-time Subscriptions                                   │
│                                                                 │
│  BUILD OPTIMIZATIONS:                                           │
│  ├── SWC Compiler                                              │
│  ├── Tree Shaking                                              │
│  ├── Bundle Analysis                                           │
│  └── Compression                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Flujo de Carga Optimizada

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │  NEXT.JS    │    │  COMPONENT  │    │  DATA       │
│  NAVIGATE   │───►│  ROUTER     │───►│  LAZY LOAD  │───►│  FETCH      │
│  TO PAGE    │    │  (SSR/SSG)  │    │  (Suspense) │    │  (Cache)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  IMMEDIATE  │    │  HYDRATE    │    │  PROGRESSIVE│    │  STALE      │
│  RESPONSE   │    │  CLIENT     │    │  LOADING    │    │  WHILE      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  INTERACTIVE│    │  FULL       │    │  COMPONENT  │    │  FRESH      │
│  UI         │    │  FUNCTIONALITY│  │  RENDERED   │    │  DATA       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 8. ARQUITECTURA DE DEPLOYMENT

### 8.1 Pipeline de Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DEVELOPMENT ENVIRONMENT:                                       │
│  ├── Local Development (localhost:3000)                        │
│  ├── Hot Reloading                                             │
│  ├── Development Database                                      │
│  └── Debug Tools                                               │
│                                                                 │
│  STAGING ENVIRONMENT:                                           │
│  ├── Vercel Preview Deployments                                │
│  ├── Staging Database                                          │
│  ├── Integration Tests                                         │
│  └── Performance Testing                                       │
│                                                                 │
│  PRODUCTION ENVIRONMENT:                                        │
│  ├── Vercel Production                                         │
│  ├── Production Database                                       │
│  ├── CDN (Global Distribution)                                 │
│  └── Monitoring & Analytics                                    │
│                                                                 │
│  CI/CD PIPELINE:                                                │
│  ├── Git Push                                                  │
│  ├── Automated Tests                                           │
│  ├── Build Process                                             │
│  └── Deployment                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Flujo de Deployment

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   DEVELOPER │    │  GIT        │    │  VERCEL     │    └─────────────┘
│  PUSH CODE  │───►│  REPOSITORY │───►│  BUILD      │
│  TO BRANCH  │    │  (GitHub)   │    │  PROCESS    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  CODE       │    │  AUTOMATED  │    │  DEPLOYMENT │
│  REVIEW     │    │  TESTS      │    │  TO STAGING │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  MERGE      │    │  BUILD      │    │  PRODUCTION │
│  TO MAIN    │    │  SUCCESS    │    │  DEPLOYMENT │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  TRIGGER    │    │  ENVIRONMENT│    │  MONITORING │
│  DEPLOYMENT │    │  VARIABLES  │    │  & HEALTH   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 9. ARQUITECTURA DE MONITOREO

### 9.1 Sistema de Monitoreo

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  APPLICATION MONITORING:                                        │
│  ├── Error Tracking (Console)                                  │
│  ├── Performance Metrics                                       │
│  ├── User Analytics                                            │
│  └── Real-time Alerts                                          │
│                                                                 │
│  INFRASTRUCTURE MONITORING:                                     │
│  ├── Server Health                                             │
│  ├── Database Performance                                      │
│  ├── Network Latency                                           │
│  └── Resource Usage                                            │
│                                                                 │
│  BUSINESS METRICS:                                              │
│  ├── User Engagement                                           │
│  ├── Conversion Rates                                          │
│  ├── Email Campaign Performance                                │
│  └── Client Acquisition                                        │
│                                                                 │
│  LOGGING SYSTEM:                                                │
│  ├── Structured Logging                                        │
│  ├── Log Aggregation                                           │
│  ├── Log Analysis                                              │
│  └── Retention Policies                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 10. CONCLUSIONES

La arquitectura de Stralyze está diseñada siguiendo principios modernos de desarrollo web, con una separación clara de responsabilidades y un enfoque en la escalabilidad, mantenibilidad y performance. Los flujogramas presentados muestran la interacción entre los diferentes componentes del sistema, desde la capa de presentación hasta la base de datos.

### 10.1 Puntos Clave de la Arquitectura

1. **Modularidad**: Componentes reutilizables y bien definidos
2. **Escalabilidad**: Arquitectura preparada para crecimiento
3. **Seguridad**: Múltiples capas de protección
4. **Performance**: Optimizaciones en todos los niveles
5. **Mantenibilidad**: Código bien estructurado y documentado

### 10.2 Beneficios de la Arquitectura

- **Desarrollo Rápido**: Herramientas modernas y bien integradas
- **Alta Calidad**: TypeScript y validaciones robustas
- **Experiencia de Usuario**: Interfaz moderna y responsive
- **Operaciones Eficientes**: Deployment automatizado y monitoreo continuo

Esta arquitectura proporciona una base sólida para el desarrollo futuro y la evolución del proyecto Stralyze. 