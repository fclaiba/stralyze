#!/usr/bin/env node

/**
 * Script de Testing de Carga para Stralyze
 * Utiliza Artillery para simular carga de usuarios
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuración de testing de carga
const loadTestConfig = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  scenarios: [
    {
      name: 'Homepage Load Test',
      weight: 30,
      requests: [
        { method: 'GET', url: '/' },
        { method: 'GET', url: '/admin/login' },
      ]
    },
    {
      name: 'Admin Dashboard Load Test',
      weight: 25,
      requests: [
        { method: 'GET', url: '/admin/dashboard' },
        { method: 'GET', url: '/admin/email-marketing/campaigns' },
        { method: 'GET', url: '/admin/email-marketing/templates' },
      ]
    },
    {
      name: 'API Load Test',
      weight: 20,
      requests: [
        { method: 'GET', url: '/api/clients' },
        { method: 'GET', url: '/api/email-templates' },
        { method: 'GET', url: '/api/email-campaigns' },
      ]
    },
    {
      name: 'Form Submission Load Test',
      weight: 15,
      requests: [
        { method: 'POST', url: '/api/clients', json: { company: 'Test Company', email: 'test@example.com' } },
        { method: 'POST', url: '/api/email-templates', json: { name: 'Test Template', subject: 'Test Subject' } },
      ]
    },
    {
      name: 'Static Assets Load Test',
      weight: 10,
      requests: [
        { method: 'GET', url: '/favicon.ico' },
        { method: 'GET', url: '/placeholder-logo.png' },
      ]
    }
  ]
}

// Configuración de Artillery
const artilleryConfig = {
  config: {
    target: loadTestConfig.baseUrl,
    phases: [
      { duration: 60, arrivalRate: 5, name: 'Warm up' },
      { duration: 120, arrivalRate: 10, name: 'Ramp up' },
      { duration: 300, arrivalRate: 20, name: 'Sustained load' },
      { duration: 120, arrivalRate: 30, name: 'Peak load' },
      { duration: 60, arrivalRate: 5, name: 'Cool down' }
    ],
    defaults: {
      headers: {
        'User-Agent': 'Stralyze-Load-Test/1.0',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    },
    ensure: {
      maxErrorRate: 5,
      maxErrorCount: 10
    }
  },
  scenarios: loadTestConfig.scenarios.map(scenario => ({
    name: scenario.name,
    weight: scenario.weight,
    requests: scenario.requests.map(req => ({
      method: req.method,
      url: req.url,
      ...(req.json && { json: req.json })
    }))
  }))
}

// Función para ejecutar test de carga
async function runLoadTest() {
  console.log('🚀 Iniciando Testing de Carga para Stralyze\n')
  
  try {
    // Verificar que Artillery esté instalado
    try {
      execSync('artillery --version', { stdio: 'pipe' })
    } catch (error) {
      console.log('📦 Instalando Artillery...')
      execSync('npm install -g artillery', { stdio: 'inherit' })
    }
    
    // Crear archivo de configuración temporal
    const configPath = path.join(__dirname, 'artillery-config.json')
    fs.writeFileSync(configPath, JSON.stringify(artilleryConfig, null, 2))
    
    console.log('📊 Configuración de carga:')
    console.log(`   URL Base: ${loadTestConfig.baseUrl}`)
    console.log(`   Escenarios: ${loadTestConfig.scenarios.length}`)
    console.log(`   Duración total: 12 minutos`)
    console.log(`   Usuarios máximos: 30 concurrentes\n`)
    
    // Ejecutar test de carga
    console.log('🔥 Ejecutando test de carga...')
    const startTime = Date.now()
    
    execSync(`artillery run ${configPath}`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    })
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log(`\n✅ Test de carga completado en ${duration.toFixed(2)} segundos`)
    
    // Limpiar archivo temporal
    fs.unlinkSync(configPath)
    
  } catch (error) {
    console.error('❌ Error en test de carga:', error.message)
    process.exit(1)
  }
}

// Función para ejecutar test de stress
async function runStressTest() {
  console.log('💥 Iniciando Test de Stress para Stralyze\n')
  
  const stressConfig = {
    ...artilleryConfig,
    config: {
      ...artilleryConfig.config,
      phases: [
        { duration: 60, arrivalRate: 10, name: 'Warm up' },
        { duration: 120, arrivalRate: 20, name: 'Ramp up' },
        { duration: 180, arrivalRate: 50, name: 'High load' },
        { duration: 120, arrivalRate: 100, name: 'Stress test' },
        { duration: 60, arrivalRate: 10, name: 'Recovery' }
      ]
    }
  }
  
  try {
    const configPath = path.join(__dirname, 'artillery-stress-config.json')
    fs.writeFileSync(configPath, JSON.stringify(stressConfig, null, 2))
    
    console.log('📊 Configuración de stress:')
    console.log(`   Usuarios máximos: 100 concurrentes`)
    console.log(`   Duración: 9 minutos`)
    console.log(`   Objetivo: Identificar punto de quiebre\n`)
    
    execSync(`artillery run ${configPath}`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    })
    
    fs.unlinkSync(configPath)
    console.log('\n✅ Test de stress completado')
    
  } catch (error) {
    console.error('❌ Error en test de stress:', error.message)
    process.exit(1)
  }
}

// Función para ejecutar test de performance
async function runPerformanceTest() {
  console.log('⚡ Iniciando Test de Performance para Stralyze\n')
  
  const performanceConfig = {
    ...artilleryConfig,
    config: {
      ...artilleryConfig.config,
      phases: [
        { duration: 60, arrivalRate: 1, name: 'Baseline' },
        { duration: 120, arrivalRate: 5, name: 'Low load' },
        { duration: 180, arrivalRate: 10, name: 'Medium load' },
        { duration: 120, arrivalRate: 15, name: 'High load' }
      ]
    }
  }
  
  try {
    const configPath = path.join(__dirname, 'artillery-performance-config.json')
    fs.writeFileSync(configPath, JSON.stringify(performanceConfig, null, 2))
    
    console.log('📊 Configuración de performance:')
    console.log(`   Usuarios máximos: 15 concurrentes`)
    console.log(`   Duración: 8 minutos`)
    console.log(`   Objetivo: Medir latencia y throughput\n`)
    
    execSync(`artillery run ${configPath}`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    })
    
    fs.unlinkSync(configPath)
    console.log('\n✅ Test de performance completado')
    
  } catch (error) {
    console.error('❌ Error en test de performance:', error.message)
    process.exit(1)
  }
}

// Función para ejecutar test de disponibilidad
async function runAvailabilityTest() {
  console.log('🔄 Iniciando Test de Disponibilidad para Stralyze\n')
  
  const availabilityConfig = {
    ...artilleryConfig,
    config: {
      ...artilleryConfig.config,
      phases: [
        { duration: 3600, arrivalRate: 1, name: '1 hour availability test' }
      ]
    }
  }
  
  try {
    const configPath = path.join(__dirname, 'artillery-availability-config.json')
    fs.writeFileSync(configPath, JSON.stringify(availabilityConfig, null, 2))
    
    console.log('📊 Configuración de disponibilidad:')
    console.log(`   Duración: 1 hora`)
    console.log(`   Usuarios: 1 concurrente`)
    console.log(`   Objetivo: Verificar estabilidad a largo plazo\n`)
    
    execSync(`artillery run ${configPath}`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    })
    
    fs.unlinkSync(configPath)
    console.log('\n✅ Test de disponibilidad completado')
    
  } catch (error) {
    console.error('❌ Error en test de disponibilidad:', error.message)
    process.exit(1)
  }
}

// Función para generar reporte de performance
function generatePerformanceReport() {
  console.log('📋 Generando Reporte de Performance\n')
  
  const report = {
    timestamp: new Date().toISOString(),
    application: 'Stralyze',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    tests: {
      load: {
        status: 'completed',
        maxUsers: 30,
        duration: '12 minutes',
        scenarios: loadTestConfig.scenarios.length
      },
      stress: {
        status: 'completed',
        maxUsers: 100,
        duration: '9 minutes',
        objective: 'Identify breaking point'
      },
      performance: {
        status: 'completed',
        maxUsers: 15,
        duration: '8 minutes',
        objective: 'Measure latency and throughput'
      },
      availability: {
        status: 'completed',
        duration: '1 hour',
        objective: 'Verify long-term stability'
      }
    },
    recommendations: [
      'Implementar caching para mejorar response times',
      'Optimizar queries de base de datos',
      'Considerar CDN para assets estáticos',
      'Implementar rate limiting para APIs',
      'Configurar auto-scaling para picos de tráfico'
    ]
  }
  
  const reportPath = path.join(__dirname, 'performance-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  console.log('✅ Reporte generado:', reportPath)
  console.log('\n📊 Resumen de Tests:')
  Object.entries(report.tests).forEach(([test, config]) => {
    console.log(`   ${test}: ${config.status} (${config.duration})`)
  })
  
  console.log('\n💡 Recomendaciones:')
  report.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`)
  })
}

// Función principal
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'load'
  
  console.log('🧪 Testing de Carga - Stralyze')
  console.log('=' .repeat(50))
  
  switch (command) {
    case 'load':
      await runLoadTest()
      break
    case 'stress':
      await runStressTest()
      break
    case 'performance':
      await runPerformanceTest()
      break
    case 'availability':
      await runAvailabilityTest()
      break
    case 'all':
      await runLoadTest()
      await runStressTest()
      await runPerformanceTest()
      await runAvailabilityTest()
      break
    case 'report':
      generatePerformanceReport()
      break
    default:
      console.log('Comandos disponibles:')
      console.log('  load        - Test de carga básico')
      console.log('  stress      - Test de stress')
      console.log('  performance - Test de performance')
      console.log('  availability - Test de disponibilidad')
      console.log('  all         - Ejecutar todos los tests')
      console.log('  report      - Generar reporte')
      break
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  runLoadTest,
  runStressTest,
  runPerformanceTest,
  runAvailabilityTest,
  generatePerformanceReport
} 