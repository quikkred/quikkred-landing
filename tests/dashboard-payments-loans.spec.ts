import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';

async function login(page: Page, email: string = TEST_EMAIL) {
  await page.goto(`${BASE_URL}/login`);

  // Email fill karo
  await page.getByPlaceholder('Enter your email').fill(email);

  // Send OTP click karo
  await page.getByRole('button', { name: 'Send OTP' }).click();

  // OTP input aane tak wait karo
  const otpInput = page.getByPlaceholder(/otp|code|pin|digit/i)
    .or(page.locator('input[type="number"]'))
    .or(page.locator('input[maxlength="6"]'))
    .first();

  await otpInput.waitFor({ timeout: 10000 });
  await otpInput.fill('123456');

  // Force click verify button
  await page.getByRole('button', { name: 'Verify OTP & Login' })
    .click({ force: true });

  // ✅ Kisi bhi URL change ka wait karo — /dashboard nahi pata exact
  await page.waitForURL(
    url => !url.toString().includes('/login'),
    { timeout: 20000 }
  );
}

test.describe('Dashboard — Payments & Loans', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    // ✅ Current URL print karo — debugging ke liye
    console.log('✅ Navigated to:', page.url());
  });

  test('should display the Payments section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /payments/i })
        .or(page.getByText(/payments/i).first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display the Loans section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /loans/i })
        .or(page.getByText(/loans/i).first())
    ).toBeVisible({ timeout: 10000 });
  });

});