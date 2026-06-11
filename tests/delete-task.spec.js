const { test, expect } = require('@playwright/test');

test('should delete a task', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'test@gmail.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // 2. Add a temporary task to delete
  await page.fill('input[name="title"]', 'Task to delete');
  await page.fill('textarea[name="description"]', 'This task will be deleted');
  await page.click('button[type="submit"]');

  // 3. Wait for the task to appear
  const taskTitle = page.locator('text=Task to delete');
  await expect(taskTitle).toBeVisible();

  // 4. Handle the browser dialog (confirm box)
  page.on('dialog', dialog => dialog.accept());

  // 5. Click the delete button
  await page.click('button[title="Delete Task"]');

  // 6. Verify the task is gone
  await expect(taskTitle).not.toBeVisible();
});