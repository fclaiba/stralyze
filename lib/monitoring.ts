/**
 * Sistema de Monitoring y Logging para Stralyze
 * Configuración para producción con Sentry, Analytics y Performance Monitoring
 */

import * as Sentry from '@sentry/nextjs'

// Configuración de Sentry para error tracking
export function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'your-domain.com'],
        }),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
    })
  }
}

// Función para capturar errores
export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    })
  } else {
    console.error('Error captured:', error, context)
  }
}

// Función para capturar mensajes
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, level)
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`)
  }
}

// Función para tracking de performance
export function trackPerformance(name: string, duration: number, metadata?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addPerformanceEntry({
      name,
      startTime: Date.now() - duration,
      duration,
      entryType: 'measure',
    })
  }
  
  // Log local para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance: ${name} took ${duration}ms`, metadata)
  }
}

// Función para tracking de eventos de usuario
export function trackUserEvent(eventName: string, properties?: Record<string, any>) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
  
  // Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: eventName,
      data: properties,
      level: 'info',
    })
  }
}

// Función para tracking de navegación
export function trackPageView(url: string, title?: string) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_location: url,
      page_title: title,
    })
  }
  
  // Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page view: ${title || url}`,
      data: { url, title },
      level: 'info',
    })
  }
}

// Función para tracking de errores de API
export function trackApiError(endpoint: string, status: number, error: any) {
  const context = {
    endpoint,
    status,
    error: error?.message || error,
  }
  
  captureError(new Error(`API Error: ${endpoint} - ${status}`), context)
  
  // Métricas adicionales
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.increment('api.error', 1, {
      tags: {
        endpoint,
        status: status.toString(),
      },
    })
  }
}

// Función para tracking de performance de base de datos
export function trackDatabaseQuery(query: string, duration: number, success: boolean) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.timing('database.query.duration', duration, {
      tags: {
        query: query.substring(0, 50), // Truncar para evitar logs muy largos
        success: success.toString(),
      },
    })
  }
}

// Función para tracking de autenticación
export function trackAuthEvent(event: 'login' | 'logout' | 'register' | 'password_reset', success: boolean) {
  trackUserEvent(`auth_${event}`, { success })
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.increment('auth.event', 1, {
      tags: {
        event,
        success: success.toString(),
      },
    })
  }
}

// Función para tracking de email marketing
export function trackEmailEvent(event: 'sent' | 'opened' | 'clicked' | 'bounced', campaignId: string) {
  trackUserEvent(`email_${event}`, { campaignId })
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.increment('email.event', 1, {
      tags: {
        event,
        campaignId,
      },
    })
  }
}

// Función para tracking de errores de formularios
export function trackFormError(formName: string, field: string, error: string) {
  const context = {
    formName,
    field,
    error,
  }
  
  captureError(new Error(`Form Error: ${formName}.${field}`), context)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.increment('form.error', 1, {
      tags: {
        formName,
        field,
      },
    })
  }
}

// Función para tracking de performance de componentes
export function trackComponentRender(componentName: string, renderTime: number) {
  trackPerformance(`component.render.${componentName}`, renderTime)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.timing('component.render.duration', renderTime, {
      tags: {
        component: componentName,
      },
    })
  }
}

// Función para tracking de errores de carga de recursos
export function trackResourceError(resourceType: string, url: string, error: any) {
  const context = {
    resourceType,
    url,
    error: error?.message || error,
  }
  
  captureError(new Error(`Resource Error: ${resourceType}`), context)
}

// Función para tracking de métricas de negocio
export function trackBusinessMetric(metricName: string, value: number, tags?: Record<string, string>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.gauge(`business.${metricName}`, value, {
      tags,
    })
  }
  
  // Log local para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`Business Metric: ${metricName} = ${value}`, tags)
  }
}

// Función para tracking de sesiones de usuario
export function trackUserSession(userId: string, sessionData: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({
      id: userId,
      ...sessionData,
    })
  }
}

// Función para limpiar datos de usuario (GDPR compliance)
export function clearUserData() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser(null)
  }
}

// Función para obtener métricas de performance
export function getPerformanceMetrics() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    }
  }
  return null
}

// Función para reportar métricas de performance
export function reportPerformanceMetrics() {
  const metrics = getPerformanceMetrics()
  if (metrics) {
    Object.entries(metrics).forEach(([key, value]) => {
      trackPerformance(`page.${key}`, value)
    })
  }
}

// Configuración de Google Analytics
export function initGoogleAnalytics() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    // Cargar Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    document.head.appendChild(script)
    
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    window.gtag('js', new Date())
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Exportar funciones principales
export const monitoring = {
  initSentry,
  captureError,
  captureMessage,
  trackPerformance,
  trackUserEvent,
  trackPageView,
  trackApiError,
  trackDatabaseQuery,
  trackAuthEvent,
  trackEmailEvent,
  trackFormError,
  trackComponentRender,
  trackResourceError,
  trackBusinessMetric,
  trackUserSession,
  clearUserData,
  getPerformanceMetrics,
  reportPerformanceMetrics,
  initGoogleAnalytics,
} 