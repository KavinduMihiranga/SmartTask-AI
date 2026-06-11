const { test, expect } = require('@playwright/test');

test('should create a task and see AI-generated sub-tasks', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'test@gmail.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard');

  // 2. Fill task details 
  await page.fill('input[name="title"]', 'Learn Playwright');
  await page.fill('textarea[name="description"]', 'Complete the automation testing project');

  // 3. Click the 'Add Task' button
  await page.click('button[type="submit"]');

  // 4. Wait for AI response
  const firstSubTask = page.locator('.subtask-item').first();
  await expect(firstSubTask).toBeVisible({ timeout: 20000 });

  // 5. Verify sub-tasks
  const subTasks = page.locator('.subtask-item');
  const count = await subTasks.count();
  console.log(`AI generated ${count} sub-tasks`); 
  
  await expect(count).toBeGreaterThanOrEqual(1); 
});