import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:5173';
const TEST_EMAIL = 'playwright@test.com';
const TEST_PASSWORD = 'test123';

// ===========================
// LOGIN HELPER
// ===========================

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page.locator('h3:has-text("All Your Tasks")')).toBeVisible({ timeout: 10000 });
}

// ===========================
// AUTH TESTS
// ===========================

test.describe('🔐 Auth', () => {

  test('should register a new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="name"]', 'Playwright User');
    await page.fill('input[name="email"]', `pw${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h2:has-text("Welcome")')).toBeVisible({ timeout: 10000 });
  });

  test('should show error for duplicate email on register', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="name"]', 'Playwright User');
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    const error = page.locator('[class*="bg-red-500"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
  });

  test('should login successfully', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    const error = page.locator('[class*="bg-red-500"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
  });

  test('should logout successfully', async ({ page }) => {
    await login(page);
    await page.click('button:has-text("Log Out")');
    await expect(page.locator('h2:has-text("Welcome")')).toBeVisible({ timeout: 5000 });
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('h2:has-text("Welcome")')).toBeVisible({ timeout: 5000 });
  });

});

// ===========================
// TASK TESTS
// ===========================

test.describe('📋 Tasks', () => {

  test('should create a task and see AI sub-tasks', async ({ page }) => {
    await login(page);
    await page.fill('input[name="title"]', 'Learn Playwright Testing');
    await page.fill('textarea[name="description"]', 'Write E2E tests for the app');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Processing with AI')).toBeVisible({ timeout: 5000 });
    const firstSubTask = page.locator('.subtask-item').first();
    await expect(firstSubTask).toBeVisible({ timeout: 30000 });
    const count = await page.locator('.subtask-item').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should show task in the task list', async ({ page }) => {
    await login(page);
    const taskTitle = `Task ${Date.now()}`;
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('textarea[name="description"]', 'Test description');
    await page.click('button[type="submit"]');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 30000 });
  });

  test('should delete a task', async ({ page }) => {
    await login(page);
    const taskTitle = `Delete Me ${Date.now()}`;
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('textarea[name="description"]', 'This will be deleted');
    await page.click('button[type="submit"]');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 30000 });
    page.on('dialog', dialog => dialog.accept());
    const taskCard = page.locator(`h4:has-text("${taskTitle}")`).locator('../..');
    await taskCard.locator('button[title="Delete Task"]').click();
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible({ timeout: 5000 });
  });

  test('should show task count in heading', async ({ page }) => {
    await login(page);
    const heading = page.locator('h3:has-text("All Your Tasks")');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('All Your Tasks');
  });

});

// ===========================
// SUB-TASK TESTS
// ===========================

test.describe('✅ Sub-tasks', () => {

  test('should toggle sub-task to completed', async ({ page }) => {
    await login(page);
    await page.fill('input[name="title"]', 'Toggle Test Task');
    await page.fill('textarea[name="description"]', 'Testing sub-task toggle');
    await page.click('button[type="submit"]');
    const firstSubTask = page.locator('.subtask-item').first();
    await expect(firstSubTask).toBeVisible({ timeout: 30000 });
    const checkbox = firstSubTask.locator('input[type="checkbox"]');
    const taskText = firstSubTask.locator('span');
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect(taskText).toHaveCSS('text-decoration-line', 'line-through', { timeout: 5000 });
    await expect(checkbox).toBeChecked();
  });

  test('should toggle sub-task back to incomplete', async ({ page }) => {
    await login(page);
    await page.fill('input[name="title"]', 'Untoggle Test Task');
    await page.fill('textarea[name="description"]', 'Testing reverse toggle');
    await page.click('button[type="submit"]');
    const firstSubTask = page.locator('.subtask-item').first();
    await expect(firstSubTask).toBeVisible({ timeout: 30000 });
    const checkbox = firstSubTask.locator('input[type="checkbox"]');
    const taskText = firstSubTask.locator('span');
    await checkbox.click();
    await expect(taskText).toHaveCSS('text-decoration-line', 'line-through', { timeout: 5000 });
    await checkbox.click();
    await expect(taskText).toHaveCSS('text-decoration-line', 'none', { timeout: 5000 });
    await expect(checkbox).not.toBeChecked();
  });

  test('should persist sub-task status after page reload', async ({ page }) => {
    await login(page);
    await page.fill('input[name="title"]', 'Persist Test Task');
    await page.fill('textarea[name="description"]', 'Testing persistence');
    await page.click('button[type="submit"]');
    const firstSubTask = page.locator('.subtask-item').first();
    await expect(firstSubTask).toBeVisible({ timeout: 30000 });
    await firstSubTask.locator('input[type="checkbox"]').click();
    await expect(firstSubTask.locator('span')).toHaveCSS('text-decoration-line', 'line-through', { timeout: 5000 });
    await page.reload();
    await expect(page.locator('h3:has-text("All Your Tasks")')).toBeVisible({ timeout: 10000 });
    const reloadedSubTask = page.locator('.subtask-item').first();
    await expect(reloadedSubTask).toBeVisible({ timeout: 10000 });
    await expect(reloadedSubTask.locator('input[type="checkbox"]')).toBeChecked();
  });

});