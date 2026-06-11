const { test, expect } = require('@playwright/test');

test('should toggle sub-task status', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'test@gmail.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // 2. Add a new task to generate sub-tasks
  await page.fill('input[name="title"]', 'Test Toggle Task');
  await page.fill('textarea[name="description"]', 'Checking sub-task toggle functionality');
  await page.click('button[type="submit"]');

  // 3. Wait for AI sub-tasks to appear
  const firstSubTask = page.locator('.subtask-item').first();
  await expect(firstSubTask).toBeVisible({ timeout: 20000 });

  // 4. Find the checkbox and the text inside the first sub-task
  const checkbox = firstSubTask.locator('input[type="checkbox"]');
  const taskText = firstSubTask.locator('span');

  // 5. Before clicking: Ensure it is not crossed out
  await expect(taskText).not.toHaveClass(/line-through/);

  // 6. Click the checkbox
  await checkbox.click();

  // 7. Verify the change (After clicking, it should have line-through)
  await expect(taskText).toHaveClass(/line-through/);
});