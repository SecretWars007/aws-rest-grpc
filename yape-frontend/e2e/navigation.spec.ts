import { test, expect } from '@playwright/test';

test.describe('Global Navigation & App Shell', () => {

  test('should redirect root URL to /dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should redirect unknown routes to /dashboard', async ({ page }) => {
    await page.goto('/ruta-inexistente');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display the sidebar brand "Yape BCP"', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1').filter({ hasText: 'Yape BCP' })).toBeVisible();
  });

  test('should display the user profile in sidebar footer', async ({ page }) => {
    await page.goto('/dashboard');
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText('Juan Pérez')).toBeVisible();
    await expect(sidebar.getByText('987654321')).toBeVisible();
  });

  test('should show "Nuevo Yapeo" quick action button in sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    const nuevoYapeo = page.locator('aside').getByText('Nuevo Yapeo');
    await expect(nuevoYapeo).toBeVisible();

    await nuevoYapeo.click();
    await expect(page).toHaveURL(/\/yapear/);
  });

  test('should highlight active sidebar link', async ({ page }) => {
    await page.goto('/dashboard');
    const dashboardLink = page.locator('aside a[routerLink="/dashboard"]');
    await expect(dashboardLink).toHaveClass(/text-primary/);
  });

  test('full user journey: Dashboard → Yapear → fill form → back to Dashboard', async ({ page }) => {
    // 1. Start at dashboard
    await page.goto('/dashboard');
    await expect(page.getByText('Bienvenido')).toBeVisible();

    // 2. Navigate to Yapear
    await page.locator('aside a[routerLink="/yapear"]').first().click();
    await expect(page).toHaveURL(/\/yapear/);
    await expect(page.getByText('Yapear - Enviar Dinero')).toBeVisible();

    // 3. Fill in the form
    await page.locator('input[formControlName="destinationPhone"]').fill('912345678');
    await page.locator('input[formControlName="amount"]').fill('25');
    await page.locator('textarea[formControlName="description"]').fill('Prueba E2E');

    // 4. Verify form is valid (submit button enabled)
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // 5. Go back to Dashboard
    await page.getByText('Volver al Dashboard').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('S/. 150.00')).toBeVisible();
  });
});
