import { test, expect } from '@playwright/test';

test.describe('Dashboard Payments & Loans', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Fill email (correct field)
    await page.getByPlaceholder('Enter your email').fill('test@example.com');

    // Click Send OTP button
    await page.getByRole('button', { name: 'Send OTP' }).click();

    // 👉 OPTIONAL: handle OTP here if required
    // await page.fill('input[name="otp"]', '123456');

    // Wait for navigation after login (adjust if needed)
    await page.waitForLoadState('networkidle');
  });

  test('Check Payments Section', async ({ page }) => {
    await expect(page.getByText('Payments')).toBeVisible();
  });

  test('Check Loans Section', async ({ page }) => {
    await expect(page.getByText('Loans')).toBeVisible();
  });

});