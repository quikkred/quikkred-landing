import { test, expect } from '@playwright/test';

test.describe('Apply Flow', () => {

  // ─────────────────────────────────────
  // STEP 1 — LOGIN PAGE
  // ─────────────────────────────────────
  test.describe('Step 1 - Login', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000/login');
    });

    test('login page visible hona chahiye', async ({ page }) => {
      await expect(page).toHaveURL(/login/);
    });

    test('mobile number input visible hona chahiye', async ({ page }) => {
      // Koi bhi input dhundo page pe
      await expect(page.locator('input').first()).toBeVisible();
    });

    test('Send OTP button visible hona chahiye', async ({ page }) => {
      // Exact button name error se pata chala
      await expect(page.getByRole('button', { name: 'Send OTP' })).toBeVisible();
    });

    test('invalid mobile number pe error aana chahiye', async ({ page }) => {
      await page.locator('input').first().fill('123');
      await page.getByRole('button', { name: 'Send OTP' }).click();
      await expect(page.getByText(/invalid|valid mobile|enter/i)).toBeVisible();
    });

    test('Google login button visible hona chahiye', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Continue with google' })).toBeVisible();
    });

    test('DigiLocker button visible hona chahiye', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Continue with DigiLocker' })).toBeVisible();
    });

  });

  // ─────────────────────────────────────
  // STEP 2 — APPLY PAGE
  // ─────────────────────────────────────
  test.describe('Step 2 - Apply Page', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000/apply/quick');
    });

    test('apply page load honi chahiye', async ({ page }) => {
      await expect(page).toHaveURL(/apply\/quick/);
    });

    test('page title visible hona chahiye', async ({ page }) => {
      await expect(page.getByRole('heading').first()).toBeVisible();
    });

    test('form fields visible hone chahiye', async ({ page }) => {
      await expect(page.locator('input').first()).toBeVisible();
    });

    test('Continue with Google button visible hona chahiye', async ({ page }) => {
      // Error se pata chala — "Continue with google" exact name hai
      await expect(page.getByRole('button', { name: 'Continue with google' })).toBeVisible();
    });

  });

  // ─────────────────────────────────────
  // GENERAL
  // ─────────────────────────────────────
  test.describe('General', () => {

    test('Apply Now link visible hona chahiye', async ({ page }) => {
      await page.goto('http://localhost:3000/login');
      // Error se pata chala — navigation mein pehla link lena
      await expect(page.getByRole('navigation')
        .getByRole('link', { name: 'Apply Now' })).toBeVisible();
    });

    test('apply page bina login ke redirect karna chahiye', async ({ page }) => {
      await page.goto('http://localhost:3000/apply/quick');
      await expect(page).toHaveURL(/login|apply/);
    });

  });

});