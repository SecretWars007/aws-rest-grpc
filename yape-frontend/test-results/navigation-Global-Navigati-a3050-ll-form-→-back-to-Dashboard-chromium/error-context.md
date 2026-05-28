# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Global Navigation & App Shell >> full user journey: Dashboard → Yapear → fill form → back to Dashboard
- Location: e2e\navigation.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('S/. 150.00')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('S/. 150.00')

```

```yaml
- complementary:
  - text: send_to_mobile
  - heading "Yape BCP" [level=1]
  - paragraph: Finanzas Digitales
  - navigation:
    - link "dashboard Dashboard":
      - /url: /dashboard
    - link "send_to_mobile Yapear":
      - /url: /yapear
    - text: history Historial person Mi Cuenta
  - link "add Nuevo Yapeo":
    - /url: /yapear
  - text: JP
  - heading "Juan Pérez" [level=4]
  - paragraph: "987654321"
- heading "Bienvenido, Juan Pérez" [level=2]
- paragraph: jueves, 28 de mayo de 2026
- text: M1 Offline
- button "refresh"
- text: account_balance_wallet
- paragraph: Saldo Disponible
- heading "S/. 150,00" [level=3]
- text: verified Cuenta BCP Activa • 987654321
- link "send_to_mobile Yapear":
  - /url: /yapear
- text: request_quote Solicitar qr_code_2 Mi QR
- heading "history Movimientos Recientes" [level=3]
- text: trending_flat
- 'heading "Para: María Rodríguez" [level=4]'
- paragraph: Enviado • 912345678
- text: "- S/. 50,00"
- paragraph: 28/05/2026, 08:21
- text: trending_flat
- 'heading "De: Carlos Mendoza" [level=4]'
- paragraph: Recibido • 999888777
- text: + S/. 25,00
- paragraph: 27/05/2026, 10:21
- text: trending_flat
- 'heading "Para: María Rodríguez" [level=4]'
- paragraph: Enviado • 912345678
- text: "- S/. 10,00"
- paragraph: 26/05/2026, 10:21
- heading "Contactos Frecuentes" [level=3]
- link "MR María Rodríguez 912 345 678":
  - /url: /yapear
  - text: MR
  - paragraph: María Rodríguez
  - paragraph: 912 345 678
- link "CM Carlos Mendoza 999 888 777":
  - /url: /yapear
  - text: CM
  - paragraph: Carlos Mendoza
  - paragraph: 999 888 777
- link "PO Pedro Ortiz 987 123 456":
  - /url: /yapear
  - text: PO
  - paragraph: Pedro Ortiz
  - paragraph: 987 123 456
- link "search Buscar otro contacto":
  - /url: /yapear
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Global Navigation & App Shell', () => {
  4  | 
  5  |   test('should redirect root URL to /dashboard', async ({ page }) => {
  6  |     await page.goto('/');
  7  |     await expect(page).toHaveURL(/\/dashboard/);
  8  |   });
  9  | 
  10 |   test('should redirect unknown routes to /dashboard', async ({ page }) => {
  11 |     await page.goto('/ruta-inexistente');
  12 |     await expect(page).toHaveURL(/\/dashboard/);
  13 |   });
  14 | 
  15 |   test('should display the sidebar brand "Yape BCP"', async ({ page }) => {
  16 |     await page.goto('/dashboard');
  17 |     await expect(page.locator('h1').filter({ hasText: 'Yape BCP' })).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should display the user profile in sidebar footer', async ({ page }) => {
  21 |     await page.goto('/dashboard');
  22 |     const sidebar = page.locator('aside');
  23 |     await expect(sidebar.getByText('Juan Pérez')).toBeVisible();
  24 |     await expect(sidebar.getByText('987654321')).toBeVisible();
  25 |   });
  26 | 
  27 |   test('should show "Nuevo Yapeo" quick action button in sidebar', async ({ page }) => {
  28 |     await page.goto('/dashboard');
  29 |     const nuevoYapeo = page.locator('aside').getByText('Nuevo Yapeo');
  30 |     await expect(nuevoYapeo).toBeVisible();
  31 | 
  32 |     await nuevoYapeo.click();
  33 |     await expect(page).toHaveURL(/\/yapear/);
  34 |   });
  35 | 
  36 |   test('should highlight active sidebar link', async ({ page }) => {
  37 |     await page.goto('/dashboard');
  38 |     const dashboardLink = page.locator('aside a[routerLink="/dashboard"]');
  39 |     await expect(dashboardLink).toHaveClass(/text-primary/);
  40 |   });
  41 | 
  42 |   test('full user journey: Dashboard → Yapear → fill form → back to Dashboard', async ({ page }) => {
  43 |     // 1. Start at dashboard
  44 |     await page.goto('/dashboard');
  45 |     await expect(page.getByText('Bienvenido')).toBeVisible();
  46 | 
  47 |     // 2. Navigate to Yapear
  48 |     await page.locator('aside a[routerLink="/yapear"]').first().click();
  49 |     await expect(page).toHaveURL(/\/yapear/);
  50 |     await expect(page.getByText('Yapear - Enviar Dinero')).toBeVisible();
  51 | 
  52 |     // 3. Fill in the form
  53 |     await page.locator('input[formControlName="destinationPhone"]').fill('912345678');
  54 |     await page.locator('input[formControlName="amount"]').fill('25');
  55 |     await page.locator('textarea[formControlName="description"]').fill('Prueba E2E');
  56 | 
  57 |     // 4. Verify form is valid (submit button enabled)
  58 |     await expect(page.locator('button[type="submit"]')).toBeEnabled();
  59 | 
  60 |     // 5. Go back to Dashboard
  61 |     await page.getByText('Volver al Dashboard').click();
  62 |     await expect(page).toHaveURL(/\/dashboard/);
> 63 |     await expect(page.getByText('S/. 150.00')).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  64 |   });
  65 | });
  66 | 
```