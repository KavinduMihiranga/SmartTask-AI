const { test, expect } = require('@playwright/test');

test('should register a new user successfully', async ({ page }) => {
  // 1. Navigate to the register page (Assuming route is /register)
  await page.goto('http://localhost:5173/register');

  // 2. Fill in Registration details
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', `testuser${Date.now()}@gmail.com`); // random email
  await page.fill('input[name="password"]', 'password123');

  // 3. Click the register button
  await page.click('button[type="submit"]');

  // 4. Verify that we are redirected to the login or dashboard
  await page.waitForURL('**/login');
await expect(page).toHaveURL(/.*login/);
});