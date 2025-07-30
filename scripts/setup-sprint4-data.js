#!/usr/bin/env node

/**
 * Script para configurar datos de prueba del Sprint 4: Email Marketing
 * Este script inserta templates y campañas de ejemplo para probar la funcionalidad
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSprint4Data() {
  console.log('🚀 Configurando datos de prueba para Sprint 4: Email Marketing...')

  try {
    // 1. Crear templates de email
    console.log('📧 Creando templates de email...')
    
    const templates = [
      {
        name: 'Welcome New Leads',
        subject: '¡Bienvenido a Stralyze! {{first_name}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">¡Hola {{first_name}}!</h1>
            <p>Bienvenido a Stralyze. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
            <p>En Stralyze, nos especializamos en:</p>
            <ul>
              <li>Consultoría estratégica</li>
              <li>Desarrollo de software</li>
              <li>Marketing digital</li>
              <li>Análisis de datos</li>
            </ul>
            <p>¿Te gustaría programar una consulta gratuita para discutir cómo podemos ayudarte?</p>
            <a href="{{consultation_link}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Agendar Consulta</a>
            <p>Saludos,<br>El equipo de Stralyze</p>
          </div>
        `,
        segment: 'new_lead'
      },
      {
        name: 'Follow-up In Process',
        subject: 'Seguimiento: {{project_name}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hola {{first_name}},</h2>
            <p>Esperamos que estés bien. Queríamos hacer un seguimiento sobre tu proyecto <strong>{{project_name}}</strong>.</p>
            <p>Estado actual: <span style="color: #007bff;">{{status}}</span></p>
            <p>Próximos pasos:</p>
            <ul>
              <li>{{next_step_1}}</li>
              <li>{{next_step_2}}</li>
            </ul>
            <p>¿Tienes alguna pregunta o necesitas aclaración sobre algún punto?</p>
            <a href="{{project_dashboard}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Ver Proyecto</a>
            <p>Saludos,<br>Tu equipo de Stralyze</p>
          </div>
        `,
        segment: 'in_process'
      },
      {
        name: 'Closed Deal Celebration',
        subject: '¡Proyecto Completado! 🎉',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #28a745;">¡Felicitaciones!</h1>
            <p>Hola {{first_name}},</p>
            <p>¡Nos complace informarte que tu proyecto <strong>{{project_name}}</strong> ha sido completado exitosamente!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Resumen del proyecto:</h3>
              <ul>
                <li>Fecha de inicio: {{start_date}}</li>
                <li>Fecha de finalización: {{end_date}}</li>
                <li>Objetivos alcanzados: {{objectives_met}}</li>
              </ul>
            </div>
            <p>Esperamos que estés satisfecho con los resultados. ¿Te gustaría trabajar en otro proyecto con nosotros?</p>
            <a href="{{new_project_link}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Nuevo Proyecto</a>
            <p>¡Gracias por confiar en Stralyze!</p>
          </div>
        `,
        segment: 'closed_deal'
      },
      {
        name: 'Re-engagement Abandoned',
        subject: '¿Te acuerdas de nosotros?',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hola {{first_name}},</h2>
            <p>Hace tiempo que no hemos tenido noticias tuyas. Esperamos que todo esté bien.</p>
            <p>En Stralyze hemos estado trabajando en nuevas soluciones que podrían interesarte:</p>
            <ul>
              <li>Nuevas tecnologías de desarrollo</li>
              <li>Estrategias de marketing actualizadas</li>
              <li>Herramientas de análisis avanzadas</li>
            </ul>
            <p>¿Te gustaría que conversemos sobre cómo podemos ayudarte con tus objetivos actuales?</p>
            <a href="{{reconnect_link}}" style="background-color: #ffc107; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reconectar</a>
            <p>Saludos,<br>El equipo de Stralyze</p>
          </div>
        `,
        segment: 'abandoned'
      }
    ]

    const { data: createdTemplates, error: templatesError } = await supabase
      .from('email_templates')
      .insert(templates)
      .select()

    if (templatesError) {
      console.error('❌ Error creando templates:', templatesError)
      return
    }

    console.log(`✅ ${createdTemplates.length} templates creados`)

    // 2. Crear campañas de email
    console.log('📬 Creando campañas de email...')
    
    const campaigns = [
      {
        name: 'Campaña de Bienvenida Q1 2024',
        template_id: createdTemplates[0].id,
        segment: 'new_lead',
        status: 'sent',
        sent_at: new Date('2024-01-15T10:00:00Z').toISOString()
      },
      {
        name: 'Seguimiento Proyectos Activos',
        template_id: createdTemplates[1].id,
        segment: 'in_process',
        status: 'scheduled',
        scheduled_at: new Date('2024-02-20T14:00:00Z').toISOString()
      },
      {
        name: 'Celebración Proyectos Completados',
        template_id: createdTemplates[2].id,
        segment: 'closed_deal',
        status: 'draft'
      },
      {
        name: 'Re-engagement Clientes Inactivos',
        template_id: createdTemplates[3].id,
        segment: 'abandoned',
        status: 'draft'
      }
    ]

    const { data: createdCampaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .insert(campaigns)
      .select()

    if (campaignsError) {
      console.error('❌ Error creando campañas:', campaignsError)
      return
    }

    console.log(`✅ ${createdCampaigns.length} campañas creadas`)

    // 3. Crear datos de tracking para la campaña enviada
    console.log('📊 Creando datos de tracking...')
    
    const trackingData = []
    const emails = [
      'cliente1@example.com',
      'cliente2@example.com',
      'cliente3@example.com',
      'cliente4@example.com',
      'cliente5@example.com'
    ]

    emails.forEach((email, index) => {
      trackingData.push({
        campaign_id: createdCampaigns[0].id,
        recipient_email: email,
        opened: Math.random() > 0.3,
        clicked: Math.random() > 0.6,
        bounced: Math.random() > 0.9,
        unsubscribed: Math.random() > 0.95,
        opened_at: Math.random() > 0.3 ? new Date('2024-01-15T10:30:00Z').toISOString() : null,
        clicked_at: Math.random() > 0.6 ? new Date('2024-01-15T11:00:00Z').toISOString() : null
      })
    })

    const { data: createdTracking, error: trackingError } = await supabase
      .from('email_tracking')
      .insert(trackingData)
      .select()

    if (trackingError) {
      console.error('❌ Error creando tracking:', trackingError)
      return
    }

    console.log(`✅ ${createdTracking.length} registros de tracking creados`)

    // 4. Crear datos de analytics
    console.log('📈 Creando datos de analytics...')
    
    const analyticsData = [
      {
        campaign_id: createdCampaigns[0].id,
        date: '2024-01-15',
        total_recipients: 5,
        total_sent: 5,
        total_delivered: 4,
        total_opened: 3,
        total_clicked: 2,
        total_bounced: 1,
        total_unsubscribed: 0,
        total_conversions: 1
      },
      {
        campaign_id: createdCampaigns[0].id,
        date: '2024-01-16',
        total_recipients: 0,
        total_sent: 0,
        total_delivered: 0,
        total_opened: 1,
        total_clicked: 0,
        total_bounced: 0,
        total_unsubscribed: 0,
        total_conversions: 0
      }
    ]

    const { data: createdAnalytics, error: analyticsError } = await supabase
      .from('email_analytics')
      .insert(analyticsData)
      .select()

    if (analyticsError) {
      console.error('❌ Error creando analytics:', analyticsError)
      return
    }

    console.log(`✅ ${createdAnalytics.length} registros de analytics creados`)

    console.log('🎉 ¡Datos de prueba del Sprint 4 configurados exitosamente!')
    console.log('\n📋 Resumen:')
    console.log(`- ${createdTemplates.length} templates de email`)
    console.log(`- ${createdCampaigns.length} campañas de email`)
    console.log(`- ${createdTracking.length} registros de tracking`)
    console.log(`- ${createdAnalytics.length} registros de analytics`)

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
setupSprint4Data() 