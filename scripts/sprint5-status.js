#!/usr/bin/env node

/**
 * Script para verificar el estado del Sprint 5: Optimización y Despliegue
 */

const fs = require('fs')
const path = require('path')

function checkSprint5Status() {
  console.log('🚀 Verificando estado del Sprint 5: Optimización y Despliegue...\n')

  const sprint5Features = {
    'Optimización de Performance': {
      'Next.js config optimizado': false,
      'Image optimization': false,
      'Bundle optimization': false,
      'Code splitting': false,
      'Headers de seguridad': false,
      'Cache optimization': false
    },
    'CI/CD Pipeline': {
      'GitHub Actions configurado': false,
      'Code quality checks': false,
      'Testing pipeline': false,
      'Security scanning': false,
      'Deployment automation': false,
      'Performance testing': false
    },
    'Monitoring y Logging': {
      'Sentry integration': false,
      'Google Analytics': false,
      'Performance tracking': false,
      'Error tracking': false,
      'User event tracking': false,
      'Business metrics': false
    },
    'Testing de Carga': {
      'Load testing scripts': false,
      'Stress testing': false,
      'Performance testing': false,
      'Availability testing': false,
      'Artillery configuration': false,
      'Performance reports': false
    },
    'Deployment': {
      'Vercel configuration': false,
      'Docker configuration': false,
      'Environment variables': false,
      'Production build': false,
      'Domain configuration': false,
      'SSL certificates': false
    },
    'Documentación': {
      'Deployment guide': false,
      'Production checklist': false,
      'Troubleshooting guide': false,
      'Performance metrics': false,
      'Maintenance procedures': false,
      'Support documentation': false
    }
  }

  // Verificar optimización de performance
  const nextConfig = fs.existsSync('next.config.mjs')
  if (nextConfig) {
    const configContent = fs.readFileSync('next.config.mjs', 'utf8')
    if (configContent.includes('optimizePackageImports')) {
      sprint5Features['Optimización de Performance']['Next.js config optimizado'] = true
    }
    if (configContent.includes('formats: [\'image/webp\', \'image/avif\']')) {
      sprint5Features['Optimización de Performance']['Image optimization'] = true
    }
    if (configContent.includes('splitChunks')) {
      sprint5Features['Optimización de Performance']['Bundle optimization'] = true
    }
    if (configContent.includes('modularizeImports')) {
      sprint5Features['Optimización de Performance']['Code splitting'] = true
    }
    if (configContent.includes('Cache-Control')) {
      sprint5Features['Optimización de Performance']['Cache optimization'] = true
    }
    if (configContent.includes('headers()')) {
      sprint5Features['Optimización de Performance']['Headers de seguridad'] = true
    }
  }

  // Verificar CI/CD pipeline
  const ciCdFile = fs.existsSync('.github/workflows/ci-cd.yml')
  if (ciCdFile) {
    const ciCdContent = fs.readFileSync('.github/workflows/ci-cd.yml', 'utf8')
    if (ciCdContent.includes('code-quality')) {
      sprint5Features['CI/CD Pipeline']['Code quality checks'] = true
    }
    if (ciCdContent.includes('test:')) {
      sprint5Features['CI/CD Pipeline']['Testing pipeline'] = true
    }
    if (ciCdContent.includes('security:')) {
      sprint5Features['CI/CD Pipeline']['Security scanning'] = true
    }
    if (ciCdContent.includes('deploy:')) {
      sprint5Features['CI/CD Pipeline']['Deployment automation'] = true
    }
    if (ciCdContent.includes('performance:')) {
      sprint5Features['CI/CD Pipeline']['Performance testing'] = true
    }
    sprint5Features['CI/CD Pipeline']['GitHub Actions configurado'] = true
  }

  // Verificar monitoring y logging
  const monitoringFile = fs.existsSync('lib/monitoring.ts')
  if (monitoringFile) {
    const monitoringContent = fs.readFileSync('lib/monitoring.ts', 'utf8')
    if (monitoringContent.includes('Sentry.init')) {
      sprint5Features['Monitoring y Logging']['Sentry integration'] = true
    }
    if (monitoringContent.includes('gtag')) {
      sprint5Features['Monitoring y Logging']['Google Analytics'] = true
    }
    if (monitoringContent.includes('trackPerformance')) {
      sprint5Features['Monitoring y Logging']['Performance tracking'] = true
    }
    if (monitoringContent.includes('captureError')) {
      sprint5Features['Monitoring y Logging']['Error tracking'] = true
    }
    if (monitoringContent.includes('trackUserEvent')) {
      sprint5Features['Monitoring y Logging']['User event tracking'] = true
    }
    if (monitoringContent.includes('trackBusinessMetric')) {
      sprint5Features['Monitoring y Logging']['Business metrics'] = true
    }
  }

  // Verificar testing de carga
  const loadTestingFile = fs.existsSync('scripts/load-testing.js')
  if (loadTestingFile) {
    const loadTestingContent = fs.readFileSync('scripts/load-testing.js', 'utf8')
    if (loadTestingContent.includes('runLoadTest')) {
      sprint5Features['Testing de Carga']['Load testing scripts'] = true
    }
    if (loadTestingContent.includes('runStressTest')) {
      sprint5Features['Testing de Carga']['Stress testing'] = true
    }
    if (loadTestingContent.includes('runPerformanceTest')) {
      sprint5Features['Testing de Carga']['Performance testing'] = true
    }
    if (loadTestingContent.includes('runAvailabilityTest')) {
      sprint5Features['Testing de Carga']['Availability testing'] = true
    }
    if (loadTestingContent.includes('artillery')) {
      sprint5Features['Testing de Carga']['Artillery configuration'] = true
    }
    if (loadTestingContent.includes('generatePerformanceReport')) {
      sprint5Features['Testing de Carga']['Performance reports'] = true
    }
  }

  // Verificar deployment
  const vercelConfig = fs.existsSync('vercel.json')
  if (vercelConfig) {
    sprint5Features['Deployment']['Vercel configuration'] = true
  }

  const dockerfile = fs.existsSync('Dockerfile')
  if (dockerfile) {
    sprint5Features['Deployment']['Docker configuration'] = true
  }

  // Verificar documentación
  const deploymentGuide = fs.existsSync('DEPLOYMENT_GUIDE.md')
  if (deploymentGuide) {
    const guideContent = fs.readFileSync('DEPLOYMENT_GUIDE.md', 'utf8')
    if (guideContent.includes('Deployment a Producción')) {
      sprint5Features['Documentación']['Deployment guide'] = true
    }
    if (guideContent.includes('Troubleshooting')) {
      sprint5Features['Documentación']['Troubleshooting guide'] = true
    }
    if (guideContent.includes('Performance')) {
      sprint5Features['Documentación']['Performance metrics'] = true
    }
    if (guideContent.includes('Mantenimiento')) {
      sprint5Features['Documentación']['Maintenance procedures'] = true
    }
    if (guideContent.includes('Soporte')) {
      sprint5Features['Documentación']['Support documentation'] = true
    }
  }

  const productionChecklist = fs.existsSync('PRODUCTION_CHECKLIST.md')
  if (productionChecklist) {
    sprint5Features['Documentación']['Production checklist'] = true
  }

  // Calcular progreso
  let totalFeatures = 0
  let completedFeatures = 0

  Object.keys(sprint5Features).forEach(category => {
    console.log(`📁 ${category}:`)
    Object.keys(sprint5Features[category]).forEach(feature => {
      const isCompleted = sprint5Features[category][feature]
      const status = isCompleted ? '✅' : '❌'
      console.log(`  ${status} ${feature}`)
      totalFeatures++
      if (isCompleted) completedFeatures++
    })
    console.log('')
  })

  const progressPercentage = Math.round((completedFeatures / totalFeatures) * 100)

  console.log('📊 ESTADO DEL SPRINT 5:')
  console.log(`✅ Características completadas: ${completedFeatures}/${totalFeatures}`)
  console.log(`📈 Progreso: ${progressPercentage}%`)

  if (progressPercentage >= 90) {
    console.log('🎉 ¡Sprint 5 prácticamente completado!')
  } else if (progressPercentage >= 70) {
    console.log('🚀 Sprint 5 en buen progreso')
  } else {
    console.log('⏳ Sprint 5 en desarrollo')
  }

  // Próximos pasos
  console.log('\n📋 PRÓXIMOS PASOS RECOMENDADOS:')
  if (progressPercentage < 100) {
    console.log('- Completar características faltantes')
    console.log('- Configurar variables de entorno de producción')
    console.log('- Realizar deployment de prueba')
    console.log('- Configurar monitoring en producción')
    console.log('- Ejecutar tests de carga completos')
  } else {
    console.log('✅ ¡Sprint 5 completado al 100%!')
    console.log('🚀 El proyecto está listo para producción')
  }

  return {
    progress: progressPercentage,
    completed: completedFeatures,
    total: totalFeatures,
    features: sprint5Features
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkSprint5Status()
}

module.exports = { checkSprint5Status } 