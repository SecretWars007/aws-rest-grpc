import { test, expect, Page } from '@playwright/test';

test.describe('Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display the welcome header with user name', async ({ page }) => {
    const heading = page.locator('h2').filter({ hasText: 'Bienvenido' });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Juan Pérez');
  });

  test('should show the current balance card', async ({ page }) => {
    await expect(page.getByText('Saldo Disponible')).toBeVisible();
    await expect(page.getByText('S/. 150.00')).toBeVisible();
  });

  test('should show account phone number', async ({ page }) => {
    await expect(page.getByText('987654321')).toBeVisible();
  });

  test('should display API health status indicator', async ({ page }) => {
    // Should eventually show either Online or Offline (not connecting forever)
    const healthIndicator = page.locator('.flex.items-center.gap-2').filter({
      hasText: /Servicio M1 Online|M1 Offline/
    });
    await expect(healthIndicator).toBeVisible({ timeout: 10_000 });
  });

  test('should show quick action buttons (Yapear, Solicitar, Mi QR)', async ({ page }) => {
    await expect(page.getByText('Yapear').first()).toBeVisible();
    await expect(page.getByText('Solicitar')).toBeVisible();
    await expect(page.getByText('Mi QR')).toBeVisible();
  });

  test('should display recent transactions list', async ({ page }) => {
    await expect(page.getByText('Movimientos Recientes')).toBeVisible();
    // Initial seeded transactions
    await expect(page.getByText('María Rodríguez').first()).toBeVisible();
    await expect(page.getByText('Carlos Mendoza').first()).toBeVisible();
  });

  test('should display frequent contacts in sidebar', async ({ page }) => {
    await expect(page.getByText('Contactos Frecuentes')).toBeVisible();
    await expect(page.getByText('Pedro Ortiz').first()).toBeVisible();
  });

  test('should navigate to Yapear page when clicking Yapear quick action', async ({ page }) => {
    await page.locator('a[routerLink="/yapear"]').first().click();
    await expect(page).toHaveURL(/\/yapear/);
    await expect(page.getByText('Yapear - Enviar Dinero')).toBeVisible();
  });

  test('should navigate via sidebar navigation links', async ({ page }) => {
    // Click "Yapear" in sidebar
    const sidebarYapear = page.locator('aside a[routerLink="/yapear"]').first();
    await sidebarYapear.click();
    await expect(page).toHaveURL(/\/yapear/);

    // Click "Dashboard" in sidebar to go back
    const sidebarDashboard = page.locator('aside a[routerLink="/dashboard"]');
    await sidebarDashboard.click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Bienvenido')).toBeVisible();
  });
});
