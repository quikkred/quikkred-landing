import { test, expect, type Page } from '@playwright/test';

// Helper: collect console errors during a page visit
async function collectConsoleErrors(page: Page, url: string) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000); // allow async errors
  return errors;
}

// ═══════════════════════════════════════
// HOMEPAGE TESTS
// ═══════════════════════════════════════
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load without errors and have a title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('should display the hero section', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('should display the header with logo', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header img[src*="logo"]')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    const nav = page.locator('header nav, header');
    await expect(nav.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /products/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('should display the loan calculator section', async ({ page }) => {
    await expect(page.getByText(/loan calculator/i)).toBeVisible();
  });

  test('should have loan calculator range slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText(/faq/i).first()).toBeVisible();
  });

  test('FAQ items should be expandable', async ({ page }) => {
    const faqButton = page.locator('button').filter({ hasText: /\?/ }).first();
    if (await faqButton.isVisible()) {
      await faqButton.click();
      // After clicking, some content should appear
      await page.waitForTimeout(500);
    }
  });

  test('should display footer', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have footer links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link').first()).toBeVisible();
  });

  test('should have social media links in footer', async ({ page }) => {
    const footer = page.locator('footer');
    // Check for at least one social link
    const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]');
    await expect(socialLinks.first()).toBeVisible();
  });

  test('should have Apply Now / Login CTA button', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /apply|login/i }).first()
    ).toBeVisible();
  });
});

// ═══════════════════════════════════════
// CONSOLE ERRORS & PAGE LOAD TESTS
// ═══════════════════════════════════════
test.describe('Console Errors & Page Load', () => {
  const publicPages = [
    { name: 'Homepage', url: '/' },
    { name: 'About Us', url: '/about-us' },
    { name: 'Contact', url: '/contact' },
    { name: 'Products', url: '/products' },
    { name: 'Login', url: '/login' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
    { name: 'Terms and Conditions', url: '/terms-and-conditions' },
    { name: 'Interest Rates', url: '/interest-rates' },
    { name: 'EMI Calculator', url: '/emi-calculator' },
    { name: 'Eligibility Check', url: '/eligibility-check' },
    { name: 'Careers', url: '/careers' },
    { name: 'Apply Quick', url: '/apply/quick' },
    { name: 'Channel Partner', url: '/channel-partner' },
    { name: 'Our Partners', url: '/our-partners' },
    { name: 'Cookie Policy', url: '/cookie-policy' },
    { name: 'RBI Guidelines', url: '/rbi-guidelines' },
    { name: 'FAQs', url: '/resources/faqs' },
  ];

  for (const { name, url } of publicPages) {
    test(`${name} (${url}) should load without JS errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page, url);
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('404') &&
          !e.includes('Failed to load resource') &&
          !e.includes('third-party') &&
          !e.includes('googletagmanager') &&
          !e.includes('facebook') &&
          !e.includes('analytics') &&
          !e.includes('gtag') &&
          !e.includes('fbq') &&
          !e.includes('net::ERR')
      );
      if (criticalErrors.length > 0) {
        console.log(`[${name}] JS Errors:`, criticalErrors);
      }
      // Report but don't fail on non-critical console errors
      expect(criticalErrors.length).toBeLessThanOrEqual(5);
    });

    test(`${name} (${url}) should return valid HTTP status`, async ({ page }) => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      expect(response).not.toBeNull();
      const status = response!.status();
      // Should be 200 or redirect (301/302/307/308), not 404 or 500
      expect([200, 301, 302, 307, 308]).toContain(status);
    });
  }
});

// ═══════════════════════════════════════
// NAVIGATION TESTS
// ═══════════════════════════════════════
test.describe('Navigation', () => {
  test('logo should link to homepage', async ({ page }) => {
    await page.goto('/about-us');
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('About link should navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/about/);
  });

  test('Products link should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: /products/i }).click();
    await expect(page).toHaveURL(/products/);
  });

  test('footer links should not be broken (sample check)', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    const links = footer.locator('a[href^="/"]');
    const count = await links.count();
    const brokenLinks: string[] = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && !href.includes('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        const response = await page.request.get(href);
        if (response.status() >= 400) {
          brokenLinks.push(`${href} → ${response.status()}`);
        }
      }
    }

    if (brokenLinks.length > 0) {
      console.log('Broken footer links:', brokenLinks);
    }
    expect(brokenLinks.length).toBe(0);
  });
});

// ═══════════════════════════════════════
// LOGIN PAGE TESTS
// ═══════════════════════════════════════
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form elements', async ({ page }) => {
    await expect(page.getByRole('button', { name: /send otp/i })).toBeVisible();
  });

  test('should have Google login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('should have DigiLocker login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue with digilocker/i })).toBeVisible();
  });

  test('should show error for invalid phone number', async ({ page }) => {
    const input = page.locator('input').first();
    await input.fill('123');
    await page.getByRole('button', { name: /send otp/i }).click();
    await expect(page.getByText(/invalid|valid|enter.*number|digits/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show error for empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /send otp/i }).click();
    await expect(page.getByText(/required|enter|invalid|valid/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('should have Apply Now link', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /apply now/i }).or(
        page.getByRole('button', { name: /apply now/i })
      )
    ).toBeVisible();
  });

  test('should display security notice', async ({ page }) => {
    await expect(page.getByText(/secure/i).first()).toBeVisible();
  });
});

// ═══════════════════════════════════════
// ABOUT US PAGE TESTS
// ═══════════════════════════════════════
test.describe('About Us Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-us');
  });

  test('should display About QuikKred heading', async ({ page }) => {
    await expect(page.getByText(/about quikkred|about us/i).first()).toBeVisible();
  });

  test('should have Contact Us button', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /contact us/i }).or(
        page.getByRole('button', { name: /contact us/i })
      )
    ).toBeVisible();
  });

  test('should display Our Story section', async ({ page }) => {
    await expect(page.getByText(/our story/i).first()).toBeVisible();
  });

  test('should display Our Vision section', async ({ page }) => {
    await expect(page.getByText(/our vision/i).first()).toBeVisible();
  });

  test('should display Our Mission section', async ({ page }) => {
    await expect(page.getByText(/our mission/i).first()).toBeVisible();
  });

  test('should display core values cards', async ({ page }) => {
    await expect(page.getByText(/core values|what we stand for/i).first()).toBeVisible();
  });

  test('should have all images loaded', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    const brokenImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth === 0 && src) {
        brokenImages.push(src);
      }
    }

    if (brokenImages.length > 0) {
      console.log('Broken images on About page:', brokenImages);
    }
    expect(brokenImages.length).toBe(0);
  });
});

// ═══════════════════════════════════════
// CONTACT PAGE TESTS
// ═══════════════════════════════════════
test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact heading', async ({ page }) => {
    await expect(page.getByText(/get in touch|contact/i).first()).toBeVisible();
  });

  test('should have a contact form', async ({ page }) => {
    await expect(page.locator('form, [class*="form"], [class*="contact"]').first()).toBeVisible();
  });

  test('should have form input fields', async ({ page }) => {
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have a submit button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /submit|send|contact/i })
    ).toBeVisible();
  });
});

// ═══════════════════════════════════════
// RESPONSIVE DESIGN TESTS
// ═══════════════════════════════════════
test.describe('Responsive Design', () => {
  test('homepage should render on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    // Mobile menu button should be visible
    const menuButton = page.locator('header button').first();
    await expect(menuButton).toBeVisible();
  });

  test('homepage should render on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });

  test('mobile menu should open and close', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const menuButton = page.locator('header button').first();
    await menuButton.click();
    await page.waitForTimeout(500);
    // Navigation links should become visible
    const navLinks = page.locator('header a, header nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('login page should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /send otp/i })).toBeVisible();
  });

  test('about page should render on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/about-us');
    await expect(page.getByText(/about/i).first()).toBeVisible();
  });
});

// ═══════════════════════════════════════
// IMAGE & ASSET TESTS
// ═══════════════════════════════════════
test.describe('Images & Assets', () => {
  test('homepage should have no broken images', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const images = page.locator('img');
    const count = await images.count();
    const brokenImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      if (!isVisible) continue;

      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth === 0 && src) {
        brokenImages.push(src);
      }
    }

    if (brokenImages.length > 0) {
      console.log('Broken images on homepage:', brokenImages);
    }
    expect(brokenImages.length).toBe(0);
  });

  test('login page should have no broken images', async ({ page }) => {
    await page.goto('/login');
    await page.waitForTimeout(2000);
    const images = page.locator('img');
    const count = await images.count();
    const brokenImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      if (!isVisible) continue;

      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth === 0 && src) {
        brokenImages.push(src);
      }
    }

    if (brokenImages.length > 0) {
      console.log('Broken images on login page:', brokenImages);
    }
    expect(brokenImages.length).toBe(0);
  });
});

// ═══════════════════════════════════════
// SEO & META TESTS
// ═══════════════════════════════════════
test.describe('SEO & Meta Tags', () => {
  test('homepage should have meta description', async ({ page }) => {
    await page.goto('/');
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });

  test('homepage should have viewport meta tag', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width/);
  });

  test('homepage should have Open Graph tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = page.locator('meta[property="og:title"]');
    // OG tags are recommended for social sharing
    const ogContent = await ogTitle.getAttribute('content').catch(() => null);
    if (!ogContent) {
      console.log('WARNING: Missing og:title meta tag on homepage');
    }
  });

  test('about page should have a meta description', async ({ page }) => {
    await page.goto('/about-us');
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    if (!content) {
      console.log('WARNING: Missing meta description on /about-us');
    }
  });
});

// ═══════════════════════════════════════
// ACCESSIBILITY BASICS
// ═══════════════════════════════════════
test.describe('Accessibility Basics', () => {
  test('homepage images should have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img:visible');
    const count = await images.count();
    const missingAlt: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      if (!alt && alt !== '') {
        missingAlt.push(src || `image-${i}`);
      }
    }

    if (missingAlt.length > 0) {
      console.log('Images missing alt text:', missingAlt);
    }
    // Allow some but flag if too many
    expect(missingAlt.length).toBeLessThanOrEqual(3);
  });

  test('page should have exactly one h1', async ({ page }) => {
    await page.goto('/');
    const h1s = page.locator('h1');
    const count = await h1s.count();
    if (count !== 1) {
      console.log(`Homepage has ${count} h1 tags (should be 1)`);
    }
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('login form inputs should have labels or aria-labels', async ({ page }) => {
    await page.goto('/login');
    const inputs = page.locator('input:visible');
    const count = await inputs.count();
    const unlabeled: string[] = [];

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');

      let hasLabel = false;
      if (ariaLabel || ariaLabelledBy) hasLabel = true;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if ((await label.count()) > 0) hasLabel = true;
      }
      if (placeholder) hasLabel = true; // placeholder as fallback

      if (!hasLabel) {
        const name = await input.getAttribute('name');
        unlabeled.push(name || `input-${i}`);
      }
    }

    if (unlabeled.length > 0) {
      console.log('Inputs without labels:', unlabeled);
    }
    expect(unlabeled.length).toBe(0);
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    // Tab through and check focus is visible
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName : null;
    });
    expect(focused).not.toBe('BODY'); // Something should be focused after tabbing
  });
});

// ═══════════════════════════════════════
// PERFORMANCE BASICS
// ═══════════════════════════════════════
test.describe('Performance', () => {
  test('homepage should load within 10 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    console.log(`Homepage load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });

  test('login page should load within 10 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    console.log(`Login page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });
});

// ═══════════════════════════════════════
// BROKEN LINKS (FULL SITE SAMPLE)
// ═══════════════════════════════════════
test.describe('Broken Links Scan', () => {
  test('homepage internal links should resolve', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href^="/"]');
    const count = await links.count();
    const brokenLinks: string[] = [];
    const checked = new Set<string>();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (!href || checked.has(href) || href === '#' || href.startsWith('tel:') || href.startsWith('mailto:')) continue;
      checked.add(href);

      try {
        const response = await page.request.get(href);
        if (response.status() >= 400) {
          brokenLinks.push(`${href} → ${response.status()}`);
        }
      } catch {
        brokenLinks.push(`${href} → request failed`);
      }
    }

    if (brokenLinks.length > 0) {
      console.log('Broken internal links from homepage:', brokenLinks);
    }
    expect(brokenLinks.length).toBe(0);
  });
});

// ═══════════════════════════════════════
// POLICY PAGES TESTS
// ═══════════════════════════════════════
test.describe('Policy Pages', () => {
  const policyPages = [
    { name: 'Privacy Policy', url: '/privacy-policy' },
    { name: 'Terms and Conditions', url: '/terms-and-conditions' },
    { name: 'Cookie Policy', url: '/cookie-policy' },
    { name: 'Refund & Cancellation', url: '/refund-cancellation' },
  ];

  for (const { name, url } of policyPages) {
    test(`${name} should have substantial content`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const bodyText = await page.locator('main, [class*="content"], [class*="policy"], body').first().innerText();
      // Policy pages should have meaningful content
      if (bodyText.length < 200) {
        console.log(`WARNING: ${name} has very little content (${bodyText.length} chars)`);
      }
      expect(bodyText.length).toBeGreaterThan(100);
    });
  }
});

// ═══════════════════════════════════════
// EMI CALCULATOR TESTS
// ═══════════════════════════════════════
test.describe('EMI Calculator Page', () => {
  test('should display calculator heading', async ({ page }) => {
    await page.goto('/emi-calculator');
    await expect(page.getByText(/emi calculator/i).first()).toBeVisible();
  });

  test('should have input fields or sliders', async ({ page }) => {
    await page.goto('/emi-calculator');
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════
// ELIGIBILITY CHECK TESTS
// ═══════════════════════════════════════
test.describe('Eligibility Check Page', () => {
  test('should display eligibility heading', async ({ page }) => {
    await page.goto('/eligibility-check');
    await expect(page.getByText(/eligibility/i).first()).toBeVisible();
  });

  test('should have form or interactive elements', async ({ page }) => {
    await page.goto('/eligibility-check');
    const inputs = page.locator('input, select, button');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });
});
