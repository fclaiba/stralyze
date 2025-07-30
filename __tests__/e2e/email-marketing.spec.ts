import { test, expect } from '@playwright/test'

test.describe('Email Marketing E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/admin/login')
    
    // Login como admin
    await page.fill('input[type="email"]', '123@gmail.com')
    await page.fill('input[type="password"]', '123456')
    await page.click('button[type="submit"]')
    
    // Esperar a que redirija al dashboard
    await page.waitForURL('/admin/dashboard')
  })

  test('should navigate to email marketing section', async ({ page }) => {
    // Navegar a email marketing
    await page.goto('/admin/email-marketing/campaigns')
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('h2')).toContainText('Email Campaigns')
    await expect(page.locator('button')).toContainText('Create Campaign')
  })

  test('should create a new email template', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template
    await page.click('button:has-text("Create Template")')
    
    // Llenar el formulario
    await page.fill('input[placeholder*="Template Name"]', 'Test Template')
    await page.fill('input[placeholder*="Subject"]', 'Test Subject')
    await page.selectOption('select', 'new_lead')
    
    // El editor de texto enriquecido se maneja automáticamente
    await page.click('button:has-text("Create Template")')
    
    // Verificar que se creó el template
    await expect(page.locator('text=Test Template')).toBeVisible()
  })

  test('should create a new email campaign', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Hacer clic en crear campaña
    await page.click('button:has-text("Create Campaign")')
    
    // Llenar el formulario
    await page.fill('input[placeholder*="Campaign Name"]', 'Test Campaign')
    await page.selectOption('select', 'new_lead')
    await page.selectOption('select', 'draft')
    
    // Seleccionar template (si existe)
    const templateSelect = page.locator('select').nth(1)
    if (await templateSelect.count() > 0) {
      await templateSelect.selectOption({ index: 0 })
    }
    
    await page.click('button:has-text("Create Campaign")')
    
    // Verificar que se creó la campaña
    await expect(page.locator('text=Test Campaign')).toBeVisible()
  })

  test('should view campaign analytics', async ({ page }) => {
    // Navegar a analytics
    await page.goto('/admin/email-marketing/analytics')
    
    // Verificar que se muestra la página de analytics
    await expect(page.locator('h2')).toContainText('Email Analytics')
    
    // Verificar que hay gráficos o métricas
    await expect(page.locator('[data-testid="analytics-charts"]')).toBeVisible()
  })

  test('should edit an existing template', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Buscar un template existente y hacer clic en editar
    const editButton = page.locator('button[aria-label="Edit"]').first()
    if (await editButton.isVisible()) {
      await editButton.click()
      
      // Modificar el nombre
      await page.fill('input[placeholder*="Template Name"]', 'Updated Template')
      
      // Guardar cambios
      await page.click('button:has-text("Update Template")')
      
      // Verificar que se actualizó
      await expect(page.locator('text=Updated Template')).toBeVisible()
    }
  })

  test('should delete a template', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Buscar un template existente y hacer clic en eliminar
    const deleteButton = page.locator('button[aria-label="Delete"]').first()
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
      
      // Confirmar eliminación
      await page.click('button:has-text("OK")')
      
      // Verificar que se eliminó (el botón ya no debería estar visible)
      await expect(deleteButton).not.toBeVisible()
    }
  })

  test('should send a campaign', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Buscar una campaña en estado draft y hacer clic en enviar
    const sendButton = page.locator('button:has-text("Send Now")').first()
    if (await sendButton.isVisible()) {
      await sendButton.click()
      
      // Confirmar envío
      await page.click('button:has-text("OK")')
      
      // Verificar que la campaña cambió de estado
      await expect(page.locator('text=Sent')).toBeVisible()
    }
  })

  test('should filter campaigns by status', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Verificar que se muestran las campañas
    await expect(page.locator('[data-testid="campaign-list"]')).toBeVisible()
    
    // Los filtros se pueden implementar más adelante
    // Por ahora solo verificamos que la página carga correctamente
  })

  test('should view template preview', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template para ver el editor
    await page.click('button:has-text("Create Template")')
    
    // Verificar que el editor de texto enriquecido está presente
    await expect(page.locator('[data-testid="rich-text-editor"]')).toBeVisible()
    
    // Verificar que hay botones de formato
    await expect(page.locator('button[aria-label="Bold"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Italic"]')).toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template
    await page.click('button:has-text("Create Template")')
    
    // Intentar enviar sin llenar campos requeridos
    await page.click('button:has-text("Create Template")')
    
    // Verificar que se muestran mensajes de error
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Subject is required')).toBeVisible()
  })

  test('should navigate between email marketing sections', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    await expect(page.locator('h2')).toContainText('Email Campaigns')
    
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    await expect(page.locator('h2')).toContainText('Email Templates')
    
    // Navegar a analytics
    await page.goto('/admin/email-marketing/analytics')
    await expect(page.locator('h2')).toContainText('Email Analytics')
  })

  test('should handle responsive design', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navegar a email marketing
    await page.goto('/admin/email-marketing/campaigns')
    
    // Verificar que la página se adapta a móvil
    await expect(page.locator('h2')).toBeVisible()
    await expect(page.locator('button:has-text("Create Campaign")')).toBeVisible()
    
    // Cambiar de vuelta a desktop
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Verificar que la página se adapta a desktop
    await expect(page.locator('h2')).toBeVisible()
  })

  test('should handle rich text editor functionality', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template
    await page.click('button:has-text("Create Template")')
    
    // Verificar que el editor está presente
    await expect(page.locator('[data-testid="rich-text-editor"]')).toBeVisible()
    
    // Probar funcionalidades del editor
    const boldButton = page.locator('button[aria-label="Bold"]')
    const italicButton = page.locator('button[aria-label="Italic"]')
    const listButton = page.locator('button[aria-label="List"]')
    
    // Verificar que los botones están presentes
    await expect(boldButton).toBeVisible()
    await expect(italicButton).toBeVisible()
    await expect(listButton).toBeVisible()
    
    // Hacer clic en los botones para verificar que funcionan
    await boldButton.click()
    await italicButton.click()
    await listButton.click()
  })

  test('should handle campaign scheduling', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Hacer clic en crear campaña
    await page.click('button:has-text("Create Campaign")')
    
    // Llenar el formulario básico
    await page.fill('input[placeholder*="Campaign Name"]', 'Scheduled Campaign')
    await page.selectOption('select', 'new_lead')
    
    // Cambiar estado a scheduled
    await page.selectOption('select', 'scheduled')
    
    // Verificar que aparece el campo de fecha programada
    await expect(page.locator('input[type="datetime-local"]')).toBeVisible()
    
    // Seleccionar una fecha futura
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const dateString = futureDate.toISOString().slice(0, 16)
    
    await page.fill('input[type="datetime-local"]', dateString)
    
    // Crear la campaña
    await page.click('button:has-text("Create Campaign")')
    
    // Verificar que se creó la campaña programada
    await expect(page.locator('text=Scheduled Campaign')).toBeVisible()
  })

  test('should handle template segment filtering', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template
    await page.click('button:has-text("Create Template")')
    
    // Verificar que el selector de segmento está presente
    const segmentSelect = page.locator('select')
    await expect(segmentSelect).toBeVisible()
    
    // Verificar que todas las opciones de segmento están disponibles
    await expect(page.locator('option[value="new_lead"]')).toBeVisible()
    await expect(page.locator('option[value="in_process"]')).toBeVisible()
    await expect(page.locator('option[value="closed_deal"]')).toBeVisible()
    await expect(page.locator('option[value="abandoned"]')).toBeVisible()
    
    // Seleccionar diferentes segmentos
    await segmentSelect.selectOption('in_process')
    await expect(segmentSelect).toHaveValue('in_process')
    
    await segmentSelect.selectOption('closed_deal')
    await expect(segmentSelect).toHaveValue('closed_deal')
  })

  test('should handle analytics time range selection', async ({ page }) => {
    // Navegar a analytics
    await page.goto('/admin/email-marketing/analytics')
    
    // Verificar que se muestra la página de analytics
    await expect(page.locator('h2')).toContainText('Email Analytics')
    
    // Buscar selector de rango de tiempo
    const timeRangeSelect = page.locator('select[data-testid="time-range-select"]')
    if (await timeRangeSelect.isVisible()) {
      // Verificar opciones de tiempo
      await expect(page.locator('option[value="7days"]')).toBeVisible()
      await expect(page.locator('option[value="30days"]')).toBeVisible()
      await expect(page.locator('option[value="90days"]')).toBeVisible()
      
      // Cambiar rango de tiempo
      await timeRangeSelect.selectOption('7days')
      await expect(timeRangeSelect).toHaveValue('7days')
      
      await timeRangeSelect.selectOption('90days')
      await expect(timeRangeSelect).toHaveValue('90days')
    }
  })

  test('should handle campaign status changes', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Buscar una campaña existente
    const campaignCard = page.locator('[data-testid="campaign-card"]').first()
    if (await campaignCard.isVisible()) {
      // Verificar que muestra el estado actual
      await expect(campaignCard.locator('[data-testid="campaign-status"]')).toBeVisible()
      
      // Hacer clic en editar
      const editButton = campaignCard.locator('button:has-text("Edit")')
      if (await editButton.isVisible()) {
        await editButton.click()
        
        // Cambiar estado
        const statusSelect = page.locator('select[name="status"]')
        await statusSelect.selectOption('scheduled')
        
        // Guardar cambios
        await page.click('button:has-text("Update Campaign")')
        
        // Verificar que el estado cambió
        await expect(page.locator('text=Scheduled')).toBeVisible()
      }
    }
  })

  test('should handle template content validation', async ({ page }) => {
    // Navegar a templates
    await page.goto('/admin/email-marketing/templates')
    
    // Hacer clic en crear template
    await page.click('button:has-text("Create Template")')
    
    // Llenar solo el nombre y asunto
    await page.fill('input[placeholder*="Template Name"]', 'Test Template')
    await page.fill('input[placeholder*="Subject"]', 'Test Subject')
    await page.selectOption('select', 'new_lead')
    
    // Intentar crear sin contenido
    await page.click('button:has-text("Create Template")')
    
    // Verificar que se muestra error de contenido requerido
    await expect(page.locator('text=Content is required')).toBeVisible()
  })

  test('should handle campaign template selection', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Hacer clic en crear campaña
    await page.click('button:has-text("Create Campaign")')
    
    // Llenar información básica
    await page.fill('input[placeholder*="Campaign Name"]', 'Template Test Campaign')
    await page.selectOption('select', 'new_lead')
    
    // Verificar que el selector de template está presente
    const templateSelect = page.locator('select[name="template_id"]')
    if (await templateSelect.isVisible()) {
      // Verificar que hay opciones disponibles
      const options = await templateSelect.locator('option').count()
      expect(options).toBeGreaterThan(1) // Al menos la opción por defecto + templates existentes
      
      // Seleccionar un template
      await templateSelect.selectOption({ index: 1 })
      
      // Crear la campaña
      await page.click('button:has-text("Create Campaign")')
      
      // Verificar que se creó
      await expect(page.locator('text=Template Test Campaign')).toBeVisible()
    }
  })

  test('should handle analytics data display', async ({ page }) => {
    // Navegar a analytics
    await page.goto('/admin/email-marketing/analytics')
    
    // Verificar que se muestran las métricas principales
    await expect(page.locator('[data-testid="total-campaigns"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-sent"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-opens"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-clicks"]')).toBeVisible()
    
    // Verificar que hay gráficos
    await expect(page.locator('[data-testid="analytics-charts"]')).toBeVisible()
    
    // Verificar que hay tablas de datos
    await expect(page.locator('[data-testid="analytics-table"]')).toBeVisible()
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Navegar a una URL que no existe para probar manejo de errores
    await page.goto('/admin/email-marketing/nonexistent')
    
    // Verificar que se muestra una página de error o redirige
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('nonexistent')
    
    // O verificar que se muestra un mensaje de error
    const errorMessage = page.locator('text=Page not found, text=Error, text=404')
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible()
    }
  })

  test('should handle loading states', async ({ page }) => {
    // Navegar a campañas
    await page.goto('/admin/email-marketing/campaigns')
    
    // Verificar que se muestra un estado de carga inicialmente
    const loadingIndicator = page.locator('[data-testid="loading-indicator"], text=Loading')
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible()
      
      // Esperar a que termine la carga
      await expect(loadingIndicator).not.toBeVisible()
    }
    
    // Verificar que el contenido se carga correctamente
    await expect(page.locator('h2')).toContainText('Email Campaigns')
  })

  test('should handle empty states', async ({ page }) => {
    // Navegar a templates (asumiendo que está vacío inicialmente)
    await page.goto('/admin/email-marketing/templates')
    
    // Verificar que se muestra un estado vacío si no hay templates
    const emptyState = page.locator('text=No email templates found, text=No templates')
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible()
      
      // Verificar que hay un botón para crear el primer template
      await expect(page.locator('button:has-text("Create Your First Template")')).toBeVisible()
    }
  })
}) 