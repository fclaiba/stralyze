# Stralyze - Marketing Strategic Solutions

## 🎯 Descripción
Stralyze es una plataforma integral de marketing estratégico B2B que combina CRM, email marketing, analytics y presentación de servicios en una interfaz moderna y eficiente.

## ✨ Características Principales
- 📊 Dashboard con métricas en tiempo real
- 👥 Gestión completa de clientes (CRUD)
- 📧 Sistema de email marketing avanzado
- 📈 Analytics y reportes detallados
- 🔐 Autenticación y autorización robusta
- 📱 Diseño responsive y moderno

## 🛠️ Stack Tecnológico
- **Frontend**: Next.js 15.2.4, React 19, TypeScript 5
- **UI/UX**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Supabase (PostgreSQL), Next.js Server Actions
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Editor**: TipTap

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- pnpm 8+
- Cuenta de Supabase

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/fclaiba/stralyze.git
cd stralyze

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Ejecutar en desarrollo
pnpm dev
```

## ⚙️ Configuración

### Variables de Entorno
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Configuración de Supabase
1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar scripts SQL para crear tablas
3. Configurar Row Level Security (RLS)
4. Configurar autenticación

## 🚀 Scripts Disponibles
```bash
pnpm dev          # Desarrollo local
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Verificar linting
pnpm test         # Ejecutar tests
pnpm test:watch   # Tests en modo watch
pnpm test:coverage # Tests con cobertura
```

## 📁 Estructura del Proyecto
```
stralyze/
├── app/                    # App Router de Next.js
│   ├── actions/           # Server Actions
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── dashboard/        # Componentes del dashboard
│   └── ...
├── lib/                  # Utilidades y configuraciones
├── types/                # Definiciones de tipos
└── ...
```

## 🔐 Autenticación y Autorización
El sistema utiliza Supabase Auth con los siguientes roles:
- **super-admin**: Acceso completo al sistema
- **admin**: Gestión de clientes y campañas
- **gestor**: Gestión de clientes asignados
- **user**: Acceso de solo lectura

## 📊 Modelos de Datos
### Cliente
```typescript
type Client = {
  id: string
  company: string
  status: "New Lead" | "In Process" | "Closed Deal" | "Abandoned"
  industry: string
  contact: string
  email: string
  phone: string
  // ... más campos
}
```

## 🧪 Testing
```bash
# Tests unitarios
pnpm test

# Tests de integración
pnpm test:integration

# Tests E2E
pnpm test:e2e
```

## 🚀 Deployment
### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Docker
```bash
docker build -t stralyze .
docker run -p 3000:3000 stralyze
```

## 🤝 Contribución
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia
Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte
- 📧 Email: support@stralyze.com
- 📖 Documentación: [docs.stralyze.com](https://docs.stralyze.com)
- 🐛 Issues: [GitHub Issues](https://github.com/fclaiba/stralyze/issues)

---

## 🎉 Estado del Proyecto
- ✅ Landing Page completa
- ✅ Panel administrativo funcional
- ✅ Sistema de email marketing
- ✅ Analytics y reportes
- ✅ Autenticación robusta
- 🔄 En desarrollo: Tests completos
- 🔄 En desarrollo: CI/CD pipeline
