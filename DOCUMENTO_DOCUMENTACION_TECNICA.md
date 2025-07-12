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