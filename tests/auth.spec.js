const { test, expect } = require('@playwright/test');

test('should login successfully', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('http://localhost:5173/login');

  // 2. Fill in Email and Password
  // If you don't have name attributes, use type="email" and type="password"
  await page.fill('input[type="email"]', 'test@gmail.com');
  await page.fill('input[type="password"]', 'test123');

  // 3. Click the login button
  await page.click('button[type="submit"]');

  // 4. Verify that we are redirected to the dashboard URL
  // Use waitForURL to ensure navigation completes
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*dashboard/);
});