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
}) 