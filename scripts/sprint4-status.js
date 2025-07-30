#!/usr/bin/env node

/**
 * Script para verificar el estado del Sprint 4: Email Marketing y Analytics
 */

const fs = require('fs')
const path = require('path')

function checkSprint4Status() {
  console.log('🔍 Verificando estado del Sprint 4: Email Marketing y Analytics...\n')

  const sprint4Features = {
    'Base de Datos': {
      'Tablas de email marketing': false,
      'Índices optimizados': false,
      'Relaciones entre tablas': false
    },
    'Backend': {
      'Funciones CRUD para templates': false,
      'Funciones CRUD para campañas': false,
      'Sistema de tracking': false,
      'Analytics en tiempo real': false,
      'Server actions implementadas': false
    },
    'Frontend': {
      'Página de templates': false,
      'Página de campañas': false,
      'Página de analytics': false,
      'Editor de texto enriquecido': false,
      'Formularios de creación/edición': false,
      'Dashboard de métricas': false
    },
    'Componentes': {
      'TemplateForm': false,
      'CampaignForm': false,
      'CampaignAnalytics': false,
      'RichTextEditor': false,
      'EmailMarketingView': false
    },
    'Validaciones': {
      'Schemas de Zod': false,
      'Validación de formularios': false,
      'Manejo de errores': false
    },
    'Testing': {
      'Tests unitarios': false,
      'Tests de integración': false,
      'Tests E2E': false
    },
    'Integración': {
      'Supabase configurado': false,
      'APIs funcionando': false,
      'Estado global': false
    }
  }

  // Verificar archivos de base de datos
  const supabaseSchema = fs.existsSync('supabase-schema.sql')
  if (supabaseSchema) {
    const schemaContent = fs.readFileSync('supabase-schema.sql', 'utf8')
    sprint4Features['Base de Datos']['Tablas de email marketing'] = 
      schemaContent.includes('email_templates') && 
      schemaContent.includes('email_campaigns') &&
      schemaContent.includes('email_tracking') &&
      schemaContent.includes('email_analytics')
    
    sprint4Features['Base de Datos']['Índices optimizados'] = 
      schemaContent.includes('idx_email_templates_segment') &&
      schemaContent.includes('idx_email_campaigns_template_id')
    
    sprint4Features['Base de Datos']['Relaciones entre tablas'] = 
      schemaContent.includes('references email_templates') &&
      schemaContent.includes('references email_campaigns')
  }

  // Verificar archivos de backend
  const emailDataFile = fs.existsSync('lib/data/email-marketing.ts')
  if (emailDataFile) {
    const emailDataContent = fs.readFileSync('lib/data/email-marketing.ts', 'utf8')
    sprint4Features['Backend']['Funciones CRUD para templates'] = 
      emailDataContent.includes('createEmailTemplate') &&
      emailDataContent.includes('updateEmailTemplate') &&
      emailDataContent.includes('deleteEmailTemplate')
    
    sprint4Features['Backend']['Funciones CRUD para campañas'] = 
      emailDataContent.includes('createEmailCampaign') &&
      emailDataContent.includes('updateEmailCampaign') &&
      emailDataContent.includes('deleteEmailCampaign')
    
    sprint4Features['Backend']['Sistema de tracking'] = 
      emailDataContent.includes('getEmailTracking') &&
      emailDataContent.includes('updateTrackingStatus')
    
    sprint4Features['Backend']['Analytics en tiempo real'] = 
      emailDataContent.includes('getEmailAnalytics')
  }

  // Verificar server actions
  const emailActionsFile = fs.existsSync('app/actions/email-actions.ts')
  const emailAnalyticsFile = fs.existsSync('app/actions/email-analytics-actions.ts')
  const emailTrackingFile = fs.existsSync('app/actions/email-tracking-actions.ts')
  
  if (emailActionsFile && emailAnalyticsFile && emailTrackingFile) {
    sprint4Features['Backend']['Server actions implementadas'] = true
  }

  // Verificar páginas frontend
  const templatesPage = fs.existsSync('app/admin/email-marketing/templates/page.tsx')
  const campaignsPage = fs.existsSync('app/admin/email-marketing/campaigns/page.tsx')
  const analyticsPage = fs.existsSync('app/admin/email-marketing/analytics/page.tsx')
  
  if (templatesPage) sprint4Features['Frontend']['Página de templates'] = true
  if (campaignsPage) sprint4Features['Frontend']['Página de campañas'] = true
  if (analyticsPage) sprint4Features['Frontend']['Página de analytics'] = true

  // Verificar componentes
  const templateForm = fs.existsSync('components/email-marketing/template-form.tsx')
  const campaignForm = fs.existsSync('components/email-marketing/campaign-form.tsx')
  const campaignAnalytics = fs.existsSync('components/email-marketing/campaign-analytics.tsx')
  const richTextEditor = fs.existsSync('components/email-marketing/rich-text-editor.tsx')
  const emailMarketingView = fs.existsSync('components/dashboard/email-marketing-view.tsx')
  
  if (templateForm) sprint4Features['Componentes']['TemplateForm'] = true
  if (campaignForm) sprint4Features['Componentes']['CampaignForm'] = true
  if (campaignAnalytics) sprint4Features['Componentes']['CampaignAnalytics'] = true
  if (richTextEditor) sprint4Features['Componentes']['RichTextEditor'] = true
  if (emailMarketingView) sprint4Features['Componentes']['EmailMarketingView'] = true

  // Verificar editor de texto enriquecido
  if (richTextEditor) {
    const richTextContent = fs.readFileSync('components/email-marketing/rich-text-editor.tsx', 'utf8')
    sprint4Features['Frontend']['Editor de texto enriquecido'] = 
      richTextContent.includes('@tiptap/react') &&
      richTextContent.includes('StarterKit')
  }

  // Verificar formularios
  if (templateForm && campaignForm) {
    sprint4Features['Frontend']['Formularios de creación/edición'] = true
  }

  // Verificar dashboard
  if (emailMarketingView) {
    sprint4Features['Frontend']['Dashboard de métricas'] = true
  }

  // Verificar validaciones
  const campaignSchema = fs.existsSync('lib/validations/campaign-schema.ts')
  const templateSchema = fs.existsSync('lib/validations/template-schema.ts')
  
  if (campaignSchema || templateSchema) {
    sprint4Features['Validaciones']['Schemas de Zod'] = true
  }

  // Verificar manejo de errores en formularios
  if (templateForm) {
    const templateFormContent = fs.readFileSync('components/email-marketing/template-form.tsx', 'utf8')
    sprint4Features['Validaciones']['Validación de formularios'] = 
      templateFormContent.includes('zodResolver') &&
      templateFormContent.includes('FormMessage')
  }

  // Verificar manejo de errores
  if (emailActionsFile) {
    const emailActionsContent = fs.readFileSync('app/actions/email-actions.ts', 'utf8')
    sprint4Features['Validaciones']['Manejo de errores'] = 
      emailActionsContent.includes('catch (error)') &&
      emailActionsContent.includes('error.message')
  }

  // Verificar testing
  const testFiles = [
    '__tests__/components/email-marketing.test.tsx',
    '__tests__/lib/email-marketing.test.ts',
    '__tests__/e2e/email-marketing.spec.ts'
  ]
  
  const existingTests = testFiles.filter(file => fs.existsSync(file))
  if (existingTests.length > 0) {
    sprint4Features['Testing']['Tests unitarios'] = true
  }

  // Verificar integración
  const supabaseClient = fs.existsSync('lib/supabase/client.ts')
  const supabaseServer = fs.existsSync('lib/supabase/server.ts')
  
  if (supabaseClient && supabaseServer) {
    sprint4Features['Integración']['Supabase configurado'] = true
  }

  // Verificar APIs
  const apiRoutes = [
    'app/api/email-templates/route.ts',
    'app/api/email-campaigns/route.ts',
    'app/api/email-analytics/route.ts'
  ]
  
  const existingAPIs = apiRoutes.filter(route => fs.existsSync(route))
  if (existingAPIs.length > 0) {
    sprint4Features['Integración']['APIs funcionando'] = true
  }

  // Verificar estado global
  const authProvider = fs.existsSync('components/providers/auth-provider.tsx')
  if (authProvider) {
    sprint4Features['Integración']['Estado global'] = true
  }

  // Calcular progreso
  let totalFeatures = 0
  let completedFeatures = 0

  Object.keys(sprint4Features).forEach(category => {
    Object.keys(sprint4Features[category]).forEach(feature => {
      totalFeatures++
      if (sprint4Features[category][feature]) {
        completedFeatures++
      }
    })
  })

  const progressPercentage = Math.round((completedFeatures / totalFeatures) * 100)

  // Mostrar resultados
  console.log('📊 ESTADO DEL SPRINT 4:\n')

  Object.keys(sprint4Features).forEach(category => {
    console.log(`📁 ${category}:`)
    Object.keys(sprint4Features[category]).forEach(feature => {
      const status = sprint4Features[category][feature] ? '✅' : '❌'
      console.log(`  ${status} ${feature}`)
    })
    console.log('')
  })

  console.log(`🎯 PROGRESO TOTAL: ${completedFeatures}/${totalFeatures} (${progressPercentage}%)`)

  if (progressPercentage >= 90) {
    console.log('🎉 ¡Sprint 4 prácticamente completado!')
  } else if (progressPercentage >= 70) {
    console.log('🚀 Sprint 4 en buen progreso')
  } else if (progressPercentage >= 50) {
    console.log('📈 Sprint 4 en desarrollo')
  } else {
    console.log('⚠️ Sprint 4 necesita más trabajo')
  }

  // Mostrar próximos pasos
  console.log('\n📋 PRÓXIMOS PASOS RECOMENDADOS:')
  
  if (!sprint4Features['Testing']['Tests unitarios']) {
    console.log('- Implementar tests unitarios para componentes de email marketing')
  }
  
  if (!sprint4Features['Testing']['Tests E2E']) {
    console.log('- Agregar tests E2E para flujos de email marketing')
  }
  
  if (!sprint4Features['Integración']['APIs funcionando']) {
    console.log('- Crear rutas API para email marketing')
  }
  
  if (progressPercentage < 90) {
    console.log('- Completar funcionalidades faltantes')
    console.log('- Realizar pruebas de integración')
    console.log('- Optimizar performance')
  }

  return {
    progress: progressPercentage,
    completed: completedFeatures,
    total: totalFeatures,
    features: sprint4Features
  }
}

// Ejecutar verificación
checkSprint4Status() 