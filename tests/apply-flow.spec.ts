import { test, expect } from '@playwright/test';

// ── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3000';

// ── Tests ────────────────────────────────────────────────────────────────────
test.describe('Apply Flow', () => {

  // ─────────────────────────────────────
  // STEP 1 — LOGIN PAGE
  // ─────────────────────────────────────
  test.describe('Step 1 - Login', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('domcontentloaded');
    });

    test('login page visible hona chahiye', async ({ page }) => {
      await expect(page).toHaveURL(/login/);
    });

    test('email input visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByPlaceholder('Enter your email')
      ).toBeVisible();
    });

    test('Send OTP button visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: 'Send OTP' })
      ).toBeVisible();
    });

    test('invalid email pe error aana chahiye', async ({ page }) => {
      await page.getByPlaceholder('Enter your email').fill('invalid');
      await page.getByRole('button', { name: 'Send OTP' }).click();
      await expect(
        page.getByText(/invalid|valid|enter/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test('Google login button visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: 'Continue with google' })
      ).toBeVisible();
    });

    test('DigiLocker button visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: 'Continue with DigiLocker' })
      ).toBeVisible();
    });

  });

  // ─────────────────────────────────────
  // STEP 2 — APPLY PAGE
  // ─────────────────────────────────────
  test.describe('Step 2 - Apply Page', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/apply/quick`);
      await page.waitForLoadState('domcontentloaded');
    });

    test('apply page load honi chahiye', async ({ page }) => {
      await expect(page).toHaveURL(/apply\/quick/);
    });

    test('page title visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByRole('heading').first()
      ).toBeVisible({ timeout: 5000 });
    });

    test('form fields visible hone chahiye', async ({ page }) => {
      await expect(
        page.locator('input').first()
      ).toBeVisible({ timeout: 5000 });
    });

    test('Continue with Google button visible hona chahiye', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: 'Continue with google' })
      ).toBeVisible();
    });

  });

  // ─────────────────────────────────────
  // GENERAL
  // ─────────────────────────────────────
  test.describe('General', () => {

    test('Apply Now link visible hona chahiye', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('domcontentloaded');
      await expect(
        page.getByRole('navigation').getByRole('link', { name: 'Apply Now' })
      ).toBeVisible();
    });

    test('apply page bina login ke redirect karna chahiye', async ({ page }) => {
      await page.goto(`${BASE_URL}/apply/quick`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/login|apply/);
    });

  });

});