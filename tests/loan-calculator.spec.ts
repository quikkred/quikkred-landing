import { test, expect } from '@playwright/test';

test.describe('Loan Calculator', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('calculator visible hona chahiye', async ({ page }) => {
    await expect(page.getByText(/loan calculator/i)).toBeVisible();
  });

  test('amount slider visible hona chahiye', async ({ page }) => {
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
  });

  test('Apply Now button visible hona chahiye', async ({ page }) => {
    await expect(page.getByRole('button', { name: /apply now|apply/i })).toBeVisible();
  });

test('slider move karne pe amount change hona chahiye', async ({ page }) => {
  const slider = page.locator('input[type="range"]').first();
  await slider.fill('50000');

  // Sirf pehla ₹50,000 check karo (calculator wala)
  await expect(page.getByText(/₹50,000/).first()).toBeVisible();
});

  test('Apply Now click pe navigate karna chahiye', async ({ page }) => {
    await page.getByRole('button', { name: /apply now|apply/i }).click();
    await expect(page).toHaveURL(/apply|login/);
  });

});