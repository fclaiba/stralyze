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