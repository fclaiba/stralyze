import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al dashboard
    await page.goto('/admin/dashboard');
  });

  test('should display dashboard with all sections', async ({ page }) => {
    // Verificar que el dashboard se carga correctamente
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Verificar que todas las secciones están presentes
    await expect(page.locator('[data-testid="acquisition-metrics"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-registrations"]')).toBeVisible();
    await expect(page.locator('[data-testid="client-list"]')).toBeVisible();
  });

  test('should filter clients correctly', async ({ page }) => {
    // Esperar a que la lista de clientes se cargue
    await page.waitForSelector('[data-testid="client-list"]');
    
    // Buscar un cliente específico
    await page.fill('[data-testid="search-input"]', 'TechCorp');
    
    // Verificar que los resultados se filtran
    await expect(page.locator('[data-testid="client-row"]')).toContainText('TechCorp');
  });

  test('should export client data', async ({ page }) => {
    // Esperar a que la lista de clientes se cargue
    await page.waitForSelector('[data-testid="client-list"]');
    
    // Hacer clic en el botón de exportar CSV
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-csv"]');
    const download = await downloadPromise;
    
    // Verificar que se descargó el archivo
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Navegar a la sección de email marketing
    await page.click('text=Email Marketing');
    await expect(page).toHaveURL(/.*email-marketing/);
    
    // Navegar de vuelta al dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });
}); 