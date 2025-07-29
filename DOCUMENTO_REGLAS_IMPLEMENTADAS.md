# DOCUMENTO DE REGLAS IMPLEMENTADAS - STRALYZE

## 1. REGLAMENTO DE DESARROLLO Y GESTIÓN DE CÓDIGO

### 1.1 Estándares de Calidad de Código

#### 1.1.1 Principios Fundamentales
- **SOLID**: Todos los componentes deben seguir los principios SOLID
- **DRY (Don't Repeat Yourself)**: Evitar duplicación de código
- **KISS (Keep It Simple, Stupid)**: Mantener el código simple y legible
- **Single Responsibility**: Cada función/componente debe tener una sola responsabilidad

#### 1.1.2 Estándares de TypeScript
```typescript
// OBLIGATORIO: Tipado estricto en todas las funciones
export async function createClientAction(
  data: Omit<Client, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; data?: Client; error?: string }> {
  // Implementación
}

// OBLIGATORIO: Interfaces bien definidas
interface CampaignFormProps {
  campaign?: EmailCampaign
  onSuccess?: () => void
  onError?: (error: string) => void
}

// OBLIGATORIO: Tipos union para estados
type ClientStatus = "New Lead" | "In Process" | "Closed Deal" | "Abandoned"
type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "cancelled"
```

#### 1.1.3 Estándares de React
```typescript
// OBLIGATORIO: Uso de "use client" solo cuando sea necesario
"use client"

// OBLIGATORIO: Props tipadas
interface ComponentProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

// OBLIGATORIO: Custom hooks para lógica reutilizable
export function useClientData(clientId: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Lógica de fetch
  }, [clientId])
  
  return { client, loading }
}
```

### 1.2 Convenciones de Nomenclatura

#### 1.2.1 Archivos y Carpetas
```
✅ CORRECTO:
- components/ui/button.tsx
- app/actions/clients.ts
- lib/data/email-marketing.ts
- types/email-marketing.ts

❌ INCORRECTO:
- components/Button.tsx
- app/Actions/Clients.ts
- lib/Data/EmailMarketing.ts
```

#### 1.2.2 Componentes y Funciones
```typescript
// OBLIGATORIO: PascalCase para componentes
export default function CampaignForm() {}
export function ClientList() {}

// OBLIGATORIO: camelCase para funciones
export async function createClientAction() {}
export function handleSubmit() {}

// OBLIGATORIO: UPPER_SNAKE_CASE para constantes
const API_ENDPOINTS = {
  CLIENTS: '/api/clients',
  CAMPAIGNS: '/api/campaigns'
}
```

#### 1.2.3 Variables y Tipos
```typescript
// OBLIGATORIO: camelCase para variables
const clientData = {}
const isSubmitting = false

// OBLIGATORIO: PascalCase para tipos e interfaces
type EmailCampaign = {}
interface ClientData = {}

// OBLIGATORIO: UPPER_SNAKE_CASE para enums
enum CLIENT_STATUS {
  NEW_LEAD = "New Lead",
  IN_PROCESS = "In Process"
}
```

### 1.3 Estructura de Archivos

#### 1.3.1 Organización Obligatoria
```
app/
├── actions/           # Server Actions únicamente
├── admin/            # Rutas del panel administrativo
├── api/              # API Routes
└── globals.css       # Estilos globales

components/
├── ui/               # Componentes base reutilizables
├── dashboard/        # Componentes específicos del dashboard
├── email-marketing/  # Componentes de email marketing
└── providers/        # Providers de contexto

lib/
├── data/             # Funciones de acceso a datos
├── supabase/         # Configuración de Supabase
├── utils.ts          # Utilidades generales
└── validations/      # Esquemas de validación

types/
├── index.ts          # Exportaciones centralizadas
├── client.ts         # Tipos de cliente
├── email-marketing.ts # Tipos de email marketing
└── user.ts           # Tipos de usuario
```

#### 1.3.2 Reglas de Importación
```typescript
// OBLIGATORIO: Imports organizados
// 1. React y Next.js
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Librerías de terceros
import { motion } from "framer-motion"
import { z } from "zod"

// 3. Componentes internos
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. Utilidades y tipos
import { createBrowserClient } from "@/lib/supabase/client"
import type { Client } from "@/types/client"
```

## 2. REGLAMENTO DE SEGURIDAD

### 2.1 Autenticación y Autorización

#### 2.1.1 Middleware Obligatorio
```typescript
// OBLIGATORIO: Protección de rutas admin
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  // Rutas públicas definidas explícitamente
  const publicRoutes = ["/admin/login", "/"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)
  
  if (request.nextUrl.pathname.startsWith("/admin") && !isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}
```

#### 2.1.2 Validación de Datos
```typescript
// OBLIGATORIO: Validación con Zod en todos los formularios
const clientSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  budget: z.string().min(1, "Budget is required")
})

// OBLIGATORIO: Sanitización de datos
export async function createClientAction(data: unknown) {
  const validatedData = clientSchema.parse(data)
  // Procesar datos validados
}
```

### 2.2 Manejo de Variables de Entorno

#### 2.2.1 Configuración Obligatoria
```env
# OBLIGATORIO: Variables de producción
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OBLIGATORIO: Variables de desarrollo
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 2.2.2 Validación de Variables
```typescript
// OBLIGATORIO: Validación de variables de entorno
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env vars are missing. " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    )
  }

  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey,
  })
}
```

## 3. REGLAMENTO DE PERFORMANCE

### 3.1 Optimizaciones Obligatorias

#### 3.1.1 Lazy Loading
```typescript
// OBLIGATORIO: Lazy loading para componentes pesados
const CampaignAnalytics = lazy(() => import("@/components/email-marketing/campaign-analytics"))

// OBLIGATORIO: Suspense boundaries
<Suspense fallback={<div>Loading analytics...</div>}>
  <CampaignAnalytics campaign={campaign} />
</Suspense>
```

#### 3.1.2 Memoización
```typescript
// OBLIGATORIO: useCallback para funciones de fetch
const fetchMetrics = useCallback(async () => {
  // Lógica de fetch
}, [])

// OBLIGATORIO: useMemo para cálculos costosos
const filteredClients = useMemo(() => {
  return clients.filter(client => client.status === selectedStatus)
}, [clients, selectedStatus])

// OBLIGATORIO: React.memo para componentes
export const ClientCard = React.memo(({ client }: ClientCardProps) => {
  return <div>{client.company}</div>
})
```

### 3.2 Configuración de Build

#### 3.2.1 Next.js Config Obligatorio
```javascript
// OBLIGATORIO: Configuración de optimización
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@react-three/fiber'],
  },
  images: {
    unoptimized: true,
  }
}
```

## 4. REGLAMENTO DE TESTING

### 4.1 Estrategia de Testing

#### 4.1.1 Tipos de Tests Obligatorios
```typescript
// OBLIGATORIO: Tests unitarios para utilidades
describe('clientUtils', () => {
  test('should format client data correctly', () => {
    const rawData = { company: 'Test Corp', email: 'test@test.com' }
    const formatted = formatClientData(rawData)
    expect(formatted).toHaveProperty('id')
  })
})

// OBLIGATORIO: Tests de integración para Server Actions
describe('createClientAction', () => {
  test('should create client successfully', async () => {
    const result = await createClientAction(mockClientData)
    expect(result.success).toBe(true)
  })
})

// OBLIGATORIO: Tests de componentes
describe('CampaignForm', () => {
  test('should render form fields', () => {
    render(<CampaignForm />)
    expect(screen.getByLabelText('Campaign Name')).toBeInTheDocument()
  })
})
```

### 4.2 Cobertura Mínima
- **Utilidades**: 90% de cobertura
- **Server Actions**: 85% de cobertura
- **Componentes**: 80% de cobertura
- **Hooks personalizados**: 90% de cobertura

## 5. REGLAMENTO DE DEPLOYMENT

### 5.1 Proceso de Deployment

#### 5.1.1 Checklist Pre-Deployment
```bash
# OBLIGATORIO: Ejecutar antes de cada deployment
pnpm lint                    # Verificar linting
pnpm type-check             # Verificar tipos TypeScript
pnpm test                   # Ejecutar tests
pnpm build                  # Build de producción
pnpm start                  # Verificar que funciona
```

#### 5.1.2 Variables de Entorno de Producción
```env
# OBLIGATORIO: Configuración de producción
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 5.2 Monitoreo y Logging

#### 5.2.1 Logging Obligatorio
```typescript
// OBLIGATORIO: Logging estructurado
export async function createClientAction(data: ClientData) {
  try {
    console.log('Creating client:', { company: data.company, email: data.email })
    const result = await createClient(data)
    console.log('Client created successfully:', { id: result.id })
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating client:', error)
    return { success: false, error: error.message }
  }
}
```

## 6. REGLAMENTO DE GESTIÓN DE ESTADO

### 6.1 Patrones de Estado

#### 6.1.1 Estado Local vs Global
```typescript
// OBLIGATORIO: Estado local para componentes específicos
const [isSubmitting, setIsSubmitting] = useState(false)
const [selectedClient, setSelectedClient] = useState<Client | null>(null)

// OBLIGATORIO: Context para estado global
export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  isAuthenticated: false,
})
```

#### 6.1.2 Server State Management
```typescript
// OBLIGATORIO: Revalidación automática
export async function updateClientAction(id: string, data: Partial<Client>) {
  try {
    const client = await updateClient(id, data)
    revalidatePath("/admin/dashboard")
    revalidatePath(`/admin/clients/${id}`)
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

## 7. REGLAMENTO DE DOCUMENTACIÓN

### 7.1 Documentación Obligatoria

#### 7.1.1 Comentarios de Código
```typescript
/**
 * Creates a new email campaign with the provided data
 * @param data - Campaign data without ID and timestamps
 * @returns Promise with success status and campaign data or error
 * @throws Error if template is not found or database operation fails
 */
export async function createEmailCampaign(
  data: Omit<EmailCampaign, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; data?: EmailCampaign; error?: string }> {
  // Implementación
}
```

#### 7.1.2 README Obligatorio
```markdown
# Stralyze - Marketing Strategic Solutions

## Descripción
Aplicación web de marketing estratégico B2B desarrollada con Next.js 15 y Supabase.

## Instalación
```bash
pnpm install
```

## Variables de Entorno
Copiar `.env.example` a `.env.local` y configurar:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Scripts Disponibles
- `pnpm dev`: Desarrollo local
- `pnpm build`: Build de producción
- `pnpm start`: Servidor de producción
- `pnpm lint`: Verificar linting
- `pnpm test`: Ejecutar tests

## Estructura del Proyecto
[Descripción de la estructura]

## Contribución
[Guía de contribución]
```

## 8. REGLAMENTO DE GIT Y WORKFLOW

### 8.1 Convenciones de Commits

#### 8.1.1 Formato Obligatorio
```bash
# OBLIGATORIO: Formato de commits
<type>(<scope>): <description>

# Ejemplos:
feat(email): add campaign scheduling functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
refactor(clients): optimize client data fetching
test(utils): add unit tests for client formatting
chore(deps): update dependencies to latest versions
```

#### 8.1.2 Tipos de Commits Permitidos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `style`: Cambios de estilo (formato, espacios, etc.)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 8.2 Branching Strategy

#### 8.2.1 Estructura de Branches
```bash
main                    # Rama principal (producción)
├── develop            # Rama de desarrollo
├── feature/email-campaigns    # Rama de funcionalidad
├── bugfix/login-issue         # Rama de corrección
└── hotfix/critical-security   # Rama de corrección crítica
```

#### 8.2.2 Reglas de Merge
- **OBLIGATORIO**: Pull Request para todas las ramas
- **OBLIGATORIO**: Code review de al menos un desarrollador
- **OBLIGATORIO**: Tests pasando antes del merge
- **OBLIGATORIO**: Build exitoso antes del merge

## 9. REGLAMENTO DE ACCESIBILIDAD

### 9.1 Estándares WCAG 2.1

#### 9.1.1 Requisitos Obligatorios
```typescript
// OBLIGATORIO: Labels para todos los inputs
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-white">Email</FormLabel>
      <FormControl>
        <Input
          {...field}
          type="email"
          aria-describedby="email-error"
          aria-required="true"
        />
      </FormControl>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>

// OBLIGATORIO: Contraste de colores mínimo 4.5:1
// OBLIGATORIO: Navegación por teclado
// OBLIGATORIO: Textos alternativos para imágenes
```

## 10. REGLAMENTO DE MANTENIMIENTO

### 10.1 Mantenimiento Preventivo

#### 10.1.1 Tareas Semanales
- Actualización de dependencias
- Revisión de logs de errores
- Verificación de performance
- Backup de base de datos

#### 10.1.2 Tareas Mensuales
- Auditoría de seguridad
- Revisión de código legacy
- Optimización de queries
- Actualización de documentación

### 10.2 Monitoreo Continuo

#### 10.2.1 Métricas Obligatorias
- Tiempo de respuesta de la aplicación
- Tasa de errores
- Uso de memoria y CPU
- Disponibilidad del servicio

## 11. REGLAMENTO DE CÓDIGO DE CONDUCTA

### 11.1 Principios de Desarrollo

#### 11.1.1 Colaboración
- **Respeto mutuo**: Tratar a todos los desarrolladores con respeto
- **Comunicación clara**: Comunicar ideas y problemas de manera clara
- **Ayuda mutua**: Ayudar a otros desarrolladores cuando sea necesario
- **Feedback constructivo**: Proporcionar feedback útil y constructivo

#### 11.1.2 Calidad de Código
- **Revisión de código**: Revisar el código de otros antes de aprobar
- **Documentación**: Documentar cambios importantes
- **Testing**: Escribir tests para nuevas funcionalidades
- **Refactorización**: Mejorar código existente cuando sea posible

### 11.2 Proceso de Revisión

#### 11.2.1 Checklist de Revisión
- [ ] El código sigue las convenciones establecidas
- [ ] Los tests pasan correctamente
- [ ] La documentación está actualizada
- [ ] No hay código duplicado
- [ ] Las variables de entorno están configuradas
- [ ] El código es legible y mantenible

## 12. SANCIONES Y CUMPLIMIENTO

### 12.1 Aplicación del Reglamento
1. **Advertencia**: Primera infracción menor
2. **Revisión de Código**: Infracción moderada
3. **Rechazo de PR**: Infracción grave
4. **Suspensión Temporal**: Infracción muy grave

### 12.2 Responsabilidades
- **Desarrolladores**: Cumplir con todos los estándares
- **Tech Lead**: Revisar y aprobar cambios
- **DevOps**: Monitorear deployment y performance
- **QA**: Verificar calidad y testing

## 13. ACTUALIZACIONES Y EVOLUCIÓN

### 13.1 Revisión Periódica
- **Mensual**: Revisar y actualizar reglas según necesidades
- **Trimestral**: Evaluar efectividad de las reglas
- **Anual**: Revisión completa del reglamento

### 13.2 Proceso de Cambio
1. **Propuesta**: Cualquier desarrollador puede proponer cambios
2. **Discusión**: Revisar propuestas en equipo
3. **Votación**: Aprobar cambios por mayoría
4. **Implementación**: Aplicar cambios gradualmente
5. **Documentación**: Actualizar documentación

---

## CONCLUSIÓN

Este reglamento es **OBLIGATORIO** para todos los desarrolladores que trabajen en el proyecto Stralyze. Su objetivo es garantizar la calidad, consistencia y mantenibilidad del código, así como fomentar un ambiente de desarrollo colaborativo y profesional.

El cumplimiento de estas reglas asegura que el proyecto mantenga altos estándares de calidad y sea escalable a largo plazo. La revisión periódica y actualización del reglamento garantiza que evolucione junto con las necesidades del proyecto y las mejores prácticas de la industria. 


# DOCUMENTO DE DOCUMENTACIÓN TÉCNICA - STRALYZE

## 1. ARQUITECTURA TÉCNICA

### 1.1 Stack Tecnológico

#### 1.1.1 Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Lenguaje**: TypeScript 5.x
- **UI Framework**: Tailwind CSS 3.4.17
- **Componentes**: Radix UI + shadcn/ui
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Editor**: TipTap (Rich Text Editor)

#### 1.1.2 Backend
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **API**: Next.js API Routes + Server Actions
- **Validación**: Zod
- **Middleware**: Next.js Middleware

#### 1.1.3 Herramientas de Desarrollo
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formateo**: Prettier
- **Build Tool**: SWC (Next.js)
- **Versionado**: Git

### 1.2 Estructura del Proyecto

```
stralyze/
├── app/                          # App Router de Next.js
│   ├── actions/                  # Server Actions
│   │   ├── clients.ts           # Acciones de clientes
│   │   ├── email-actions.ts     # Acciones de email
│   │   ├── email-campaign-actions.ts
│   │   ├── email-template-actions.ts
│   │   └── email-tracking-actions.ts
│   ├── admin/                    # Panel administrativo
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── email-marketing/     # Módulo de email marketing
│   │   ├── login/               # Página de login
│   │   └── register-user/       # Registro de usuarios
│   ├── api/                      # API Routes
│   │   ├── auth/                # Endpoints de autenticación
│   │   └── clients/             # Endpoints de clientes
│   ├── compol/                   # Página política
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── dashboard/               # Componentes del dashboard
│   ├── email-marketing/         # Componentes de email marketing
│   ├── political/               # Componentes políticos
│   ├── providers/               # Providers de contexto
│   └── [otros componentes]
├── lib/                         # Utilidades y configuraciones
│   ├── data/                    # Funciones de acceso a datos
│   ├── middleware/              # Middlewares personalizados
│   ├── supabase/                # Configuración de Supabase
│   ├── utils.ts                 # Utilidades generales
│   └── validations/             # Esquemas de validación
├── types/                       # Definiciones de tipos TypeScript
├── public/                      # Archivos estáticos
├── styles/                      # Estilos adicionales
└── [archivos de configuración]
```

## 2. CONFIGURACIÓN DEL PROYECTO

### 2.1 Dependencias Principales

#### 2.1.1 Core Dependencies
```json
{
  "next": "15.2.4",
  "react": "^19",
  "react-dom": "^19",
  "typescript": "^5"
}
```

#### 2.1.2 UI y Styling
```json
{
  "tailwindcss": "^3.4.17",
  "tailwindcss-animate": "^1.0.7",
  "@radix-ui/react-*": "latest",
  "framer-motion": "latest",
  "lucide-react": "^0.454.0"
}
```

#### 2.1.3 Backend y Database
```json
{
  "@supabase/supabase-js": "latest",
  "@supabase/auth-helpers-nextjs": "latest"
}
```

#### 2.1.4 Forms y Validation
```json
{
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "zod": "^3.24.1"
}
```

### 2.2 Configuración de TypeScript

#### 2.2.1 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 Configuración de Tailwind CSS

#### 2.3.1 tailwind.config.ts
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // ... más colores personalizados
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

### 2.4 Configuración de Next.js

#### 2.4.1 next.config.mjs
```javascript
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  transpilePackages: ['three', '@react-three/fiber'],
  experimental: {
    serverComponentsExternalPackages: ['three'],
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@react-three/fiber'],
  },
}
```

## 3. BASE DE DATOS Y MODELOS

### 3.1 Configuración de Supabase

#### 3.1.1 Cliente de Supabase
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env vars are missing. " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    )
  }

  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey,
  })
}
```

#### 3.1.2 Cliente de Servidor
```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service role credentials")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
```

### 3.2 Esquema de Base de Datos

#### 3.2.1 Tabla de Clientes
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New Lead',
  industry TEXT,
  contact TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  payment_method TEXT,
  contract_status TEXT DEFAULT 'Pending',
  deposit DECIMAL(10,2) DEFAULT 0,
  final_payment DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  budget TEXT,
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_at ON clients(created_at);
```

#### 3.2.2 Tabla de Templates de Email
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  segment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_email_templates_segment ON email_templates(segment);
```

#### 3.2.3 Tabla de Campañas de Email
```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id) ON DELETE RESTRICT,
  segment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_segment ON email_campaigns(segment);
CREATE INDEX idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);
```

#### 3.2.4 Tabla de Tracking de Email
```sql
CREATE TABLE email_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounce_reason TEXT,
  tracking_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_email_tracking_campaign_id ON email_tracking(campaign_id);
CREATE INDEX idx_email_tracking_status ON email_tracking(status);
CREATE INDEX idx_email_tracking_tracking_id ON email_tracking(tracking_id);
```

## 4. SERVER ACTIONS Y API ROUTES

### 4.1 Server Actions

#### 4.1.1 Gestión de Clientes
```typescript
// app/actions/clients.ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient, updateClient, deleteClient } from "@/lib/data/clients"
import type { Client } from "@/types/client"

export async function createClientAction(
  data: Omit<Client, "id" | "createdAt" | "updatedAt">
) {
  try {
    const client = await createClient(data)
    revalidatePath("/admin/dashboard")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "Failed to create client" }
  }
}

export async function updateClientAction(id: string, data: Partial<Client>) {
  try {
    const client = await updateClient(id, data)
    if (!client) {
      return { success: false, error: "Client not found" }
    }
    revalidatePath("/admin/dashboard")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "Failed to update client" }
  }
}

export async function deleteClientAction(id: string) {
  try {
    const success = await deleteClient(id)
    if (!success) {
      return { success: false, error: "Client not found" }
    }
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete client" }
  }
}
```

#### 4.1.2 Email Marketing Actions
```typescript
// app/actions/email-campaign-actions.ts
"use server"

import { revalidatePath } from "next/cache"
import * as emailData from "@/lib/data/email-marketing"
import type { EmailCampaign } from "@/types/email-marketing"

export async function fetchEmailCampaigns(): Promise<{
  success: boolean
  data?: EmailCampaign[]
  error?: string
}> {
  try {
    const campaigns = await emailData.getEmailCampaigns()
    return { success: true, data: campaigns }
  } catch (error) {
    console.error("Error fetching email campaigns:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email campaigns",
    }
  }
}

export async function deleteEmailCampaignAction(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await emailData.deleteEmailCampaign(id)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true }
  } catch (error) {
    console.error("Error deleting email campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete email campaign",
    }
  }
}
```

### 4.2 API Routes

#### 4.2.1 Endpoint de Clientes
```typescript
// app/api/clients/route.ts
import { NextResponse } from "next/server"
import { getClients, createClient } from "@/lib/data/clients"
import { z } from "zod"

const createClientSchema = z.object({
  company: z.string().min(2),
  status: z.enum(["New Lead", "In Process", "Closed Deal", "Abandoned"]),
  industry: z.string(),
  contact: z.string(),
  email: z.string().email(),
  phone: z.string(),
  paymentMethod: z.string(),
  contractStatus: z.enum(["Pending", "Drafted", "Under Review", "Signed", "Completed", "Cancelled"]),
  deposit: z.number().min(0),
  finalPayment: z.number().min(0),
  totalAmount: z.number().min(0),
})

export async function GET() {
  try {
    const clients = await getClients()
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    try {
      const validatedData = createClientSchema.parse(body)
      const newClient = await createClient(validatedData)
      return NextResponse.json(newClient, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.format() },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
```

## 5. COMPONENTES Y UI

### 5.1 Estructura de Componentes

#### 5.1.1 Componentes Base (shadcn/ui)
```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 5.1.2 Componentes Especializados
```typescript
// components/email-marketing/campaign-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createCampaign, updateCampaign } from "@/app/actions/email-actions"
import { fetchEmailTemplatesBySegment } from "@/app/actions/email-template-actions"
import type { EmailCampaign, EmailTemplate } from "@/types/email-marketing"

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template_id: z.string().min(1, "Template is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
  status: z.enum(["draft", "scheduled"]),
  scheduled_at: z.string().nullable().optional(),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

interface CampaignFormProps {
  campaign?: EmailCampaign
  onSuccess?: () => void
}

export default function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedSegment, setSelectedSegment] = useState(campaign?.segment || "new_lead")
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name || "",
      template_id: campaign?.template_id || "",
      segment: campaign?.segment || "new_lead",
      status: campaign?.status === "sent" ? "draft" : campaign?.status || "draft",
      scheduled_at: campaign?.scheduled_at || null,
    },
  })

  // ... resto de la implementación
}
```

### 5.2 Providers y Context

#### 5.2.1 AuthProvider
```typescript
// components/providers/auth-provider.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

type AuthContextType = {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        setSession(currentSession)

        if (currentSession) {
          console.log("Sesión activa encontrada:", currentSession.user.email)
        } else {
          console.log("No se encontró sesión activa")
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Evento de autenticación:", event)
      setSession(newSession)

      if (event === "SIGNED_IN") {
        router.refresh()
      }
      if (event === "SIGNED_OUT") {
        router.refresh()
        router.push("/admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <AuthContext.Provider value={{ session, isLoading, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 6. MIDDLEWARE Y AUTENTICACIÓN

### 6.1 Middleware de Autenticación
```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const publicRoutes = ["/admin/login"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (request.nextUrl.pathname.startsWith("/admin") && !isPublicRoute && !session) {
    console.log("No hay sesión, redirigiendo a login")
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (request.nextUrl.pathname === "/admin/login" && session) {
    console.log("Sesión activa, redirigiendo a dashboard")
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
```

## 7. VALIDACIÓN Y TIPOS

### 7.1 Esquemas de Validación
```typescript
// lib/validations/form-schema.ts
import { z } from "zod"

export const clientSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  status: z.enum(["New Lead", "In Process", "Closed Deal", "Abandoned"]),
  industry: z.string().min(1, "Industry is required"),
  contact: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  contractStatus: z.enum(["Pending", "Drafted", "Under Review", "Signed", "Completed", "Cancelled"]),
  deposit: z.number().min(0, "Deposit must be non-negative"),
  finalPayment: z.number().min(0, "Final payment must be non-negative"),
  totalAmount: z.number().min(0, "Total amount must be non-negative"),
  budget: z.string().min(1, "Budget is required"),
})

export const emailCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  template_id: z.string().min(1, "Template is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
  status: z.enum(["draft", "scheduled"]),
  scheduled_at: z.string().nullable().optional(),
})

export const emailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
})
```

### 7.2 Tipos TypeScript
```typescript
// types/index.ts
import type { Client } from "./client"
import type { User, UserRole } from "./user"
import type { Activity } from "./activity"
import type { Form } from "./form"

export type { Client, User, UserRole, Activity, Form }

export type ClientType = {
  id: string
  company: string
  status: "New Lead" | "In Process" | "Closed Deal" | "Abandoned"
  industry: string
  contact: string
  email: string
  phone: string
  paymentMethod: string
  contractStatus: "Pending" | "Drafted" | "Under Review" | "Signed" | "Completed" | "Cancelled"
  deposit: number
  finalPayment: number
  totalAmount: number
  services: string[]
  budget: string
  createdAt: string
  updatedAt: string
}

export type UserType = {
  id: string
  email: string
  name: string
  role: "super-admin" | "admin" | "gestor" | "user"
  password: string
  createdAt: string
  updatedAt: string
}

export type ActivityType = {
  id: string
  userId: string
  action: "create" | "update" | "delete"
  resourceType: "client" | "form" | "user"
  resourceId: string
  changes: any
  createdAt: string
}

export type FormType = {
  id: string
  clientId: string
  type: string
  status: string
  data: any
  createdAt: string
  updatedAt: string
}
```

## 8. OPTIMIZACIONES Y PERFORMANCE

### 8.1 Optimizaciones de Rendimiento

#### 8.1.1 Lazy Loading
```typescript
// Lazy loading de componentes pesados
const CampaignAnalytics = lazy(() => import("@/components/email-marketing/campaign-analytics"))
const RichTextEditor = lazy(() => import("@/components/email-marketing/rich-text-editor"))

// Suspense boundaries
<Suspense fallback={<div>Loading analytics...</div>}>
  <CampaignAnalytics campaign={campaign} />
</Suspense>
```

#### 8.1.2 Memoización
```typescript
// useCallback para funciones de fetch
const fetchMetrics = useCallback(async () => {
  try {
    setLoading(true)
    const supabase = createBrowserClient()
    const { count: totalCount, error: countError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error fetching total count:", countError)
      throw countError
    }

    // ... resto de la lógica
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
    toast({
      title: "Error",
      description: "Failed to load dashboard metrics",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}, [])

// useMemo para cálculos costosos
const filteredClients = useMemo(() => {
  return clients.filter(client => client.status === selectedStatus)
}, [clients, selectedStatus])

// React.memo para componentes
export const ClientCard = React.memo(({ client }: ClientCardProps) => {
  return (
    <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white">{client.company}</h3>
        <p className="text-gray-400">{client.contact}</p>
        <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
      </CardContent>
    </Card>
  )
})
```

### 8.2 Optimizaciones de Build

#### 8.2.1 Configuración de SWC
```javascript
// next.config.mjs
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@react-three/fiber'],
  },
}
```

## 9. DEPLOYMENT Y PRODUCCIÓN

### 9.1 Variables de Entorno

#### 9.1.1 Desarrollo (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 9.1.2 Producción (.env.production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 9.2 Scripts de Deployment
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 9.3 Checklist de Deployment
```bash
# Pre-deployment checklist
pnpm install                    # Instalar dependencias
pnpm lint                       # Verificar linting
pnpm type-check                 # Verificar tipos TypeScript
pnpm test                       # Ejecutar tests
pnpm build                      # Build de producción
pnpm start                      # Verificar que funciona
```

## 10. MONITOREO Y LOGGING

### 10.1 Logging Estructurado
```typescript
// Utilidad de logging
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '')
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
  }
}

// Uso en Server Actions
export async function createClientAction(data: ClientData) {
  try {
    logger.info('Creating client', { company: data.company, email: data.email })
    const client = await createClient(data)
    logger.info('Client created successfully', { id: client.id })
    revalidatePath("/admin/dashboard")
    return { success: true, data: client }
  } catch (error) {
    logger.error('Error creating client', error)
    return { success: false, error: "Failed to create client" }
  }
}
```

### 10.2 Métricas de Performance
```typescript
// Componente de métricas
export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    // Medir tiempo de carga de página
    const pageLoadTime = performance.now()
    setMetrics(prev => ({ ...prev, pageLoadTime }))

    // Medir uso de memoria
    if ('memory' in performance) {
      const memoryUsage = (performance as any).memory.usedJSHeapSize
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }
  }, [])

  return (
    <div className="text-xs text-gray-400">
      <p>Load Time: {metrics.pageLoadTime.toFixed(2)}ms</p>
      <p>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</p>
    </div>
  )
}
```

## 11. CONCLUSIONES

La documentación técnica de Stralyze demuestra una arquitectura moderna y bien estructurada que sigue las mejores prácticas de desarrollo web. La aplicación utiliza tecnologías de vanguardia como Next.js 15, TypeScript, Supabase y Tailwind CSS, proporcionando una base sólida para el crecimiento y escalabilidad del proyecto.

Los aspectos clave de la implementación incluyen:

1. **Arquitectura Modular**: Separación clara de responsabilidades
2. **Type Safety**: Tipado estricto con TypeScript
3. **Performance**: Optimizaciones de rendimiento implementadas
4. **Seguridad**: Autenticación y validación robustas
5. **Escalabilidad**: Diseño preparado para crecimiento
6. **Mantenibilidad**: Código bien documentado y estructurado

Esta documentación sirve como guía completa para desarrolladores que trabajen en el proyecto, asegurando consistencia y calidad en el desarrollo futuro. 


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


# DOCUMENTO DE ANÁLISIS FUNCIONAL - STRALYZE

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

### 1.1 Propósito y Objetivo
**Stralyze** es una plataforma integral de marketing estratégico B2B diseñada para proporcionar soluciones completas de marketing digital. La aplicación combina funcionalidades de CRM, email marketing, análisis de datos y presentación de servicios en una interfaz moderna y eficiente.

### 1.2 Público Objetivo
- **Empresas B2B** que requieren servicios de marketing estratégico
- **Equipos de marketing** que necesitan gestionar campañas y clientes
- **Consultores de marketing** que requieren herramientas de análisis y seguimiento

### 1.3 Propuesta de Valor
- Gestión centralizada de clientes y leads
- Automatización de campañas de email marketing
- Análisis en tiempo real de métricas de rendimiento
- Interfaz moderna con experiencia de usuario optimizada

## 2. ARQUITECTURA FUNCIONAL

### 2.1 Módulos Principales

#### 2.1.1 Módulo de Presentación (Landing Page)
**Funcionalidades:**
- Hero section con efectos visuales avanzados
- Catálogo de servicios de marketing
- Estudios de caso y testimonios
- Call-to-action para conversión

**Componentes Clave:**
- `HeroWithCanvasReveal`: Sección principal con animaciones
- `ServicesSection`: Presentación de servicios
- `CaseStudies`: Demostración de resultados
- `TestimonialsSection`: Social proof
- `CTASection`: Conversión de visitantes

#### 2.1.2 Módulo de Administración
**Funcionalidades:**
- Dashboard con métricas en tiempo real
- Gestión completa de clientes (CRUD)
- Sistema de email marketing
- Analytics y reportes

**Componentes Clave:**
- `AdminDashboard`: Panel principal con métricas
- `ClientList`: Gestión de clientes
- `TimeSeriesGraph`: Gráficos de tendencias
- `AcquisitionMetrics`: Métricas de adquisición

#### 2.1.3 Módulo de Email Marketing
**Funcionalidades:**
- Creación y gestión de templates
- Campañas programadas y automáticas
- Segmentación por estado del cliente
- Tracking de aperturas y clics
- Analytics de rendimiento

**Componentes Clave:**
- `CampaignForm`: Formulario de creación de campañas
- `CampaignAnalytics`: Análisis de campañas
- `RichTextEditor`: Editor de contenido
- `TemplateForm`: Gestión de templates

### 2.2 Modelos de Datos

#### 2.2.1 Entidad Cliente
```typescript
type Client = {
  id: string                    // Identificador único
  company: string              // Nombre de la empresa
  status: ClientStatus         // Estado del lead/cliente
  industry: string             // Industria
  contact: string              // Persona de contacto
  email: string                // Email de contacto
  phone: string                // Teléfono
  paymentMethod: string        // Método de pago
  contractStatus: ContractStatus // Estado del contrato
  deposit: number              // Pago inicial
  finalPayment: number         // Pago final
  totalAmount: number          // Monto total
  services: string[]           // Servicios contratados
  budget: string               // Presupuesto
  createdAt: string            // Fecha de creación
  updatedAt: string            // Fecha de actualización
}
```

**Estados del Cliente:**
- `New Lead`: Lead nuevo
- `In Process`: En proceso de conversión
- `Closed Deal`: Trato cerrado
- `Abandoned`: Abandonado

#### 2.2.2 Entidad Campaña de Email
```typescript
type EmailCampaign = {
  id: string                   // Identificador único
  name: string                 // Nombre de la campaña
  template_id: string          // ID del template
  segment: EmailSegment        // Segmento objetivo
  status: CampaignStatus       // Estado de la campaña
  scheduled_at: string | null  // Fecha programada
  sent_at: string | null       // Fecha de envío
  created_at: string           // Fecha de creación
  updated_at: string           // Fecha de actualización
  template?: EmailTemplate     // Template asociado
  stats?: CampaignStats        // Estadísticas
}
```

**Estados de Campaña:**
- `draft`: Borrador
- `scheduled`: Programada
- `sending`: Enviando
- `sent`: Enviada
- `cancelled`: Cancelada

#### 2.2.3 Entidad Template de Email
```typescript
type EmailTemplate = {
  id: string                   // Identificador único
  name: string                 // Nombre del template
  subject: string              // Asunto del email
  content: string              // Contenido HTML
  segment: EmailSegment        // Segmento objetivo
  created_at: string           // Fecha de creación
  updated_at: string           // Fecha de actualización
}
```

## 3. FLUJOS FUNCIONALES

### 3.1 Flujo de Autenticación
```
1. Usuario accede a /admin/login
2. Middleware verifica sesión activa
3. Si no hay sesión → Redirige a login
4. Si hay sesión → Redirige a dashboard
5. AuthProvider maneja estado global
6. Cambios de autenticación actualizan UI
```

### 3.2 Flujo de Gestión de Clientes
```
1. Dashboard muestra métricas en tiempo real
2. Lista de clientes con filtros por estado
3. Formulario de creación/edición
4. Validación de datos con Zod
5. Persistencia en Supabase
6. Actualización automática de métricas
7. Suscripción en tiempo real a cambios
```

### 3.3 Flujo de Email Marketing
```
1. Creación de templates por segmento
2. Editor de texto enriquecido (TipTap)
3. Creación de campañas con templates
4. Programación o envío inmediato
5. Tracking de aperturas y clics
6. Análisis de rendimiento
7. Reportes de métricas
```

### 3.4 Flujo de Analytics
```
1. Recolección de datos en tiempo real
2. Procesamiento de métricas
3. Visualización con gráficos (Recharts)
4. Filtros y segmentación
5. Exportación de reportes
```

## 4. REQUISITOS FUNCIONALES

### 4.1 Requisitos de Usuario Final

#### 4.1.1 Gestión de Clientes
- **RF001**: Crear nuevos clientes con información completa
- **RF002**: Editar información de clientes existentes
- **RF003**: Cambiar estado de clientes (New Lead → In Process → Closed Deal)
- **RF004**: Filtrar clientes por estado, industria, fecha
- **RF005**: Visualizar métricas de conversión en tiempo real

#### 4.1.2 Email Marketing
- **RF006**: Crear templates de email por segmento
- **RF007**: Programar campañas de email
- **RF008**: Enviar campañas inmediatamente
- **RF009**: Trackear aperturas y clics
- **RF010**: Ver analytics de rendimiento

#### 4.1.3 Dashboard y Analytics
- **RF011**: Visualizar métricas clave en dashboard
- **RF012**: Ver gráficos de tendencias temporales
- **RF013**: Exportar reportes de rendimiento
- **RF014**: Recibir notificaciones de eventos importantes

### 4.2 Requisitos del Sistema

#### 4.2.1 Autenticación y Seguridad
- **RF015**: Sistema de login seguro con Supabase Auth
- **RF016**: Protección de rutas administrativas
- **RF017**: Validación de datos en frontend y backend
- **RF018**: Manejo seguro de variables de entorno

#### 4.2.2 Performance y Escalabilidad
- **RF019**: Carga rápida de páginas (< 3 segundos)
- **RF020**: Optimización de imágenes y assets
- **RF021**: Lazy loading de componentes pesados
- **RF022**: Caching eficiente de datos

#### 4.2.3 Experiencia de Usuario
- **RF023**: Interfaz responsive (mobile-first)
- **RF024**: Animaciones fluidas con Framer Motion
- **RF025**: Feedback inmediato en acciones del usuario
- **RF026**: Manejo elegante de errores

## 5. CASOS DE USO

### 5.1 Caso de Uso: Gestión de Lead
**Actor:** Administrador de marketing
**Precondición:** Usuario autenticado en el sistema

**Flujo Principal:**
1. Administrador accede al dashboard
2. Sistema muestra métricas actuales
3. Administrador hace clic en "Nuevo Cliente"
4. Sistema presenta formulario de creación
5. Administrador completa información del lead
6. Sistema valida datos y crea el registro
7. Sistema actualiza métricas en tiempo real
8. Sistema envía notificación de nuevo lead

**Flujos Alternativos:**
- **FA1**: Datos inválidos → Sistema muestra errores
- **FA2**: Email duplicado → Sistema previene duplicación

### 5.2 Caso de Uso: Creación de Campaña de Email
**Actor:** Administrador de marketing
**Precondición:** Templates disponibles para el segmento

**Flujo Principal:**
1. Administrador accede a Email Marketing
2. Sistema muestra lista de campañas existentes
3. Administrador hace clic en "Crear Campaña"
4. Sistema presenta formulario de campaña
5. Administrador selecciona segmento objetivo
6. Sistema carga templates disponibles
7. Administrador selecciona template y programa envío
8. Sistema crea campaña y programa envío
9. Sistema envía confirmación

**Flujos Alternativos:**
- **FA1**: Sin templates disponibles → Sistema sugiere crear template
- **FA2**: Envío inmediato → Sistema procesa envío al instante

## 6. MÉTRICAS Y KPIs

### 6.1 Métricas de Negocio
- **Conversión de Leads**: New Lead → Closed Deal
- **Tiempo de Conversión**: Promedio de días por conversión
- **Valor Promedio de Trato**: Total de ventas / Número de tratos
- **ROI de Campañas**: Ingresos generados / Costo de campaña

### 6.2 Métricas Técnicas
- **Tiempo de Carga**: < 3 segundos
- **Disponibilidad**: 99.9%
- **Tasa de Error**: < 1%
- **Performance Score**: > 90

### 6.3 Métricas de Email Marketing
- **Tasa de Apertura**: Emails abiertos / Emails enviados
- **Tasa de Clic**: Clics / Emails enviados
- **Tasa de Bounce**: Emails rebotados / Emails enviados
- **Tasa de Unsubscribe**: Bajas / Emails enviados

## 7. INTEGRACIONES

### 7.1 Integraciones Actuales
- **Supabase**: Base de datos y autenticación
- **Next.js**: Framework de desarrollo
- **Tailwind CSS**: Framework de estilos
- **Framer Motion**: Animaciones
- **Recharts**: Gráficos y visualizaciones

### 7.2 Integraciones Futuras
- **Stripe**: Procesamiento de pagos
- **SendGrid**: Envío de emails
- **Google Analytics**: Analytics avanzado
- **HubSpot**: CRM externo
- **Slack**: Notificaciones

## 8. ESCALABILIDAD Y CRECIMIENTO

### 8.1 Estrategia de Escalabilidad
- **Arquitectura Modular**: Componentes reutilizables
- **Base de Datos Optimizada**: Índices y queries eficientes
- **CDN**: Distribución global de assets
- **Microservicios**: Separación de responsabilidades

### 8.2 Roadmap de Funcionalidades
- **Fase 1**: CRM básico y email marketing
- **Fase 2**: Analytics avanzado y reportes
- **Fase 3**: Automatización y workflows
- **Fase 4**: Integración con herramientas externas
- **Fase 5**: IA y machine learning

## 9. CONCLUSIONES

Stralyze representa una solución completa y moderna para la gestión de marketing B2B, combinando funcionalidades esenciales de CRM con capacidades avanzadas de email marketing y analytics. La arquitectura modular y las tecnologías modernas utilizadas garantizan una base sólida para el crecimiento y escalabilidad del proyecto.

La aplicación está diseñada para proporcionar valor inmediato a los usuarios mientras mantiene la flexibilidad para adaptarse a futuras necesidades del mercado y la evolución tecnológica. 