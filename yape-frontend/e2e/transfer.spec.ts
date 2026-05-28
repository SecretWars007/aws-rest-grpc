import { test, expect } from '@playwright/test';

test.describe('Transfer (Yapear) Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/yapear');
  });

  // ─────────────────────────────────────────────
  // Layout & Elements
  // ─────────────────────────────────────────────

  test('should display the transfer page header', async ({ page }) => {
    await expect(page.getByText('Yapear - Enviar Dinero')).toBeVisible();
    await expect(page.getByText('Envía dinero al instante')).toBeVisible();
  });

  test('should show "Volver al Dashboard" back link', async ({ page }) => {
    const backLink = page.getByText('Volver al Dashboard');
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show source phone field disabled with user phone', async ({ page }) => {
    const sourceInput = page.locator('input[formControlName="sourcePhone"]');
    await expect(sourceInput).toBeDisabled();
    await expect(sourceInput).toHaveValue('987654321');
  });

  test('should show the current balance indicator', async ({ page }) => {
    await expect(page.getByText(/Saldo actual: S\/\./)).toBeVisible();
  });

  test('should show quick contacts panel on the right', async ({ page }) => {
    await expect(page.getByText('Contactos Rápidos')).toBeVisible();
    await expect(page.getByText('María Rodríguez').first()).toBeVisible();
    await expect(page.getByText('Carlos Mendoza').first()).toBeVisible();
    await expect(page.getByText('Pedro Ortiz').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // Phone Number Validation
  // ─────────────────────────────────────────────

  test('should validate destination phone - reject invalid format', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    
    // Type invalid phone (doesn't start with 9)
    await phoneInput.fill('123456789');
    await phoneInput.blur();

    await expect(page.getByText('El celular debe tener 9 dígitos y empezar con 9')).toBeVisible();
  });

  test('should validate destination phone - accept valid format', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    
    await phoneInput.fill('912345678');
    await phoneInput.blur();

    await expect(page.getByText('Formato de celular correcto')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // Amount Validation
  // ─────────────────────────────────────────────

  test('should validate amount - reject insufficient funds', async ({ page }) => {
    const amountInput = page.locator('input[formControlName="amount"]');
    
    await amountInput.fill('999');
    await amountInput.blur();

    await expect(page.getByText('Fondos insuficientes')).toBeVisible();
  });

  test('should validate amount - reject zero or negative', async ({ page }) => {
    const amountInput = page.locator('input[formControlName="amount"]');
    
    await amountInput.fill('0');
    await amountInput.blur();

    await expect(page.getByText(/monto mínimo/)).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // Quick Contact Selection
  // ─────────────────────────────────────────────

  test('should fill destination phone when clicking a quick contact', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    
    // Click "María Rodríguez" quick contact button
    const mariaButton = page.locator('button').filter({ hasText: 'María Rodríguez' });
    await mariaButton.click();

    await expect(phoneInput).toHaveValue('912345678');
    await expect(page.getByText('Formato de celular correcto')).toBeVisible();
  });

  test('should fill destination phone when clicking Carlos Mendoza', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    
    const carlosButton = page.locator('button').filter({ hasText: 'Carlos Mendoza' });
    await carlosButton.click();

    await expect(phoneInput).toHaveValue('999888777');
  });

  // ─────────────────────────────────────────────
  // Submit Button State
  // ─────────────────────────────────────────────

  test('should disable submit button when form is invalid', async ({ page }) => {
    // Clear the destination phone (leave empty)
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    await phoneInput.fill('');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    await phoneInput.fill('912345678');

    const amountInput = page.locator('input[formControlName="amount"]');
    await amountInput.fill('10');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  // ─────────────────────────────────────────────
  // Self-Transfer Prevention
  // ─────────────────────────────────────────────

  test('should prevent self-transfer and show error', async ({ page }) => {
    const phoneInput = page.locator('input[formControlName="destinationPhone"]');
    await phoneInput.fill('987654321'); // same as source

    const amountInput = page.locator('input[formControlName="amount"]');
    await amountInput.fill('10');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await expect(page.getByText('No puedes yapearte a ti mismo')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // Message / Description field
  // ─────────────────────────────────────────────

  test('should allow typing a message/description', async ({ page }) => {
    const descInput = page.locator('textarea[formControlName="description"]');
    await descInput.fill('Pago de comida');
    await expect(descInput).toHaveValue('Pago de comida');
  });
});
