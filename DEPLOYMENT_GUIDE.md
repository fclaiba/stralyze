# 🚀 GUÍA DE DEPLOYMENT - STRALYZE

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Entorno](#configuración-de-entorno)
3. [Deployment a Producción](#deployment-a-producción)
4. [Configuración de CI/CD](#configuración-de-cicd)
5. [Monitoring y Logging](#monitoring-y-logging)
6. [Testing de Carga](#testing-de-carga)
7. [Optimización de Performance](#optimización-de-performance)
8. [Mantenimiento](#mantenimiento)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

### Software Requerido
- **Node.js**: 18.x o superior
- **pnpm**: 8.x o superior
- **Git**: 2.x o superior
- **Docker**: 20.x o superior (opcional)

### Servicios Externos
- **Supabase**: Proyecto configurado
- **Vercel**: Cuenta de deployment
- **GitHub**: Repositorio del proyecto
- **Sentry**: Error tracking (opcional)
- **Google Analytics**: Analytics (opcional)

---

## ⚙️ Configuración de Entorno

### Variables de Entorno de Producción

Crear archivo `.env.production`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0

# Monitoring Configuration
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-ga-id

# Performance Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MONITORING=true
```

### Configuración de Supabase

1. **Crear proyecto en Supabase**
2. **Ejecutar schema SQL**:
   ```bash
   psql -h your-project.supabase.co -U postgres -d postgres -f supabase-schema.sql
   ```
3. **Configurar Row Level Security (RLS)**
4. **Configurar autenticación**

---

## 🌐 Deployment a Producción

### Opción 1: Vercel (Recomendado)

#### Configuración Automática
1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno en Vercel Dashboard**
3. **Configurar dominio personalizado**
4. **Deploy automático en push a main**

#### Configuración Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

### Opción 2: Docker

#### Build de Imagen
```bash
# Build de imagen
docker build -t stralyze:latest .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.production stralyze:latest
```

#### Docker Compose
```yaml
version: '3.8'
services:
  stralyze:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
```

### Opción 3: Servidor VPS

#### Configuración de Servidor
```bash
# Instalar dependencias del sistema
sudo apt update
sudo apt install nodejs npm nginx

# Clonar repositorio
git clone https://github.com/your-username/stralyze.git
cd stralyze

# Instalar dependencias
pnpm install

# Build de producción
pnpm build

# Configurar PM2
npm install -g pm2
pm2 start npm --name "stralyze" -- start
pm2 startup
pm2 save
```

#### Configuración de Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔄 Configuración de CI/CD

### GitHub Actions

El pipeline está configurado en `.github/workflows/ci-cd.yml` e incluye:

1. **Code Quality**: ESLint, Prettier, TypeScript
2. **Testing**: Unit tests, E2E tests
3. **Build**: Compilación de producción
4. **Security**: Escaneo de vulnerabilidades
5. **Deployment**: Deploy automático a Vercel
6. **Performance**: Lighthouse CI
7. **Monitoring**: Setup de Sentry y Analytics

### Variables de Secrets

Configurar en GitHub Repository Settings > Secrets:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token
```

---

## 📊 Monitoring y Logging

### Sentry Configuration

1. **Crear proyecto en Sentry**
2. **Configurar DSN en variables de entorno**
3. **Verificar integración en aplicación**

### Google Analytics

1. **Crear propiedad en Google Analytics 4**
2. **Configurar GA_ID en variables de entorno**
3. **Verificar tracking en aplicación**

### Performance Monitoring

```bash
# Ejecutar Lighthouse CI
pnpm lhci autorun

# Ver métricas de performance
pnpm lhci open
```

---

## 🧪 Testing de Carga

### Ejecutar Tests de Carga

```bash
# Test de carga básico
node scripts/load-testing.js load

# Test de stress
node scripts/load-testing.js stress

# Test de performance
node scripts/load-testing.js performance

# Test de disponibilidad
node scripts/load-testing.js availability

# Todos los tests
node scripts/load-testing.js all

# Generar reporte
node scripts/load-testing.js report
```

### Configuración de Artillery

Los tests están configurados para:
- **Carga básica**: 30 usuarios concurrentes
- **Stress**: 100 usuarios concurrentes
- **Performance**: 15 usuarios concurrentes
- **Disponibilidad**: 1 hora de testing

---

## ⚡ Optimización de Performance

### Optimizaciones Implementadas

1. **Next.js Config**:
   - Optimización de bundles
   - Compresión de assets
   - Headers de seguridad
   - Cache optimization

2. **Image Optimization**:
   - Formatos WebP y AVIF
   - Responsive images
   - Lazy loading

3. **Code Splitting**:
   - Dynamic imports
   - Route-based splitting
   - Component-based splitting

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

---

## 🔧 Mantenimiento

### Actualizaciones Regulares

```bash
# Actualizar dependencias
pnpm update

# Verificar vulnerabilidades
pnpm audit

# Ejecutar tests
pnpm test

# Build de verificación
pnpm build
```

### Backup de Base de Datos

```bash
# Backup de Supabase
pg_dump -h your-project.supabase.co -U postgres -d postgres > backup.sql

# Restore de backup
psql -h your-project.supabase.co -U postgres -d postgres < backup.sql
```

### Monitoreo de Logs

```bash
# Ver logs de aplicación
pm2 logs stralyze

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de Build
```bash
# Limpiar cache
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

#### Error de Base de Datos
```bash
# Verificar conexión
pnpm supabase status

# Reset de base de datos
pnpm supabase db reset
```

#### Error de Performance
```bash
# Analizar bundle
pnpm analyze

# Verificar métricas
pnpm lhci autorun
```

#### Error de Deployment
```bash
# Verificar variables de entorno
vercel env ls

# Re-deploy
vercel --prod --force
```

### Contacto de Soporte

- **GitHub Issues**: [Crear issue](https://github.com/your-username/stralyze/issues)
- **Email**: support@stralyze.com
- **Documentación**: [Docs](https://docs.stralyze.com)

---

## 📈 Métricas de Éxito

### KPIs Técnicos
- **Uptime**: > 99.9%
- **Response Time**: < 200ms
- **Error Rate**: < 1%
- **Page Load Time**: < 3s

### KPIs de Negocio
- **User Engagement**: > 5 min/session
- **Conversion Rate**: > 2%
- **User Retention**: > 60%

---

## 🎯 Próximos Pasos

1. **Configurar alertas de monitoring**
2. **Implementar auto-scaling**
3. **Configurar CDN global**
4. **Implementar A/B testing**
5. **Configurar backup automático**

---

**¡Stralyze está listo para producción!** 🚀

Para soporte técnico, consultar la documentación completa o contactar al equipo de desarrollo. 