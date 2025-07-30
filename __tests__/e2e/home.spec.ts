import { test, expect } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que la página se carga
    await expect(page).toHaveTitle(/Stralyze/);
    
    // Verificar que el hero section está presente
    await expect(page.locator('h1')).toContainText('Strategic Marketing Solutions');
  });

  test('should navigate to admin login', async ({ page }) => {
    await page.goto('/');
    
    // Buscar y hacer clic en un enlace que lleve al admin
    // Esto puede variar según la estructura de tu sitio
    await page.goto('/admin/login');
    
    // Verificar que estamos en la página de login
    await expect(page.locator('h1, h2')).toContainText(/Welcome|Sign in/i);
  });
}); 