import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
  await login(page);
});

// Load Draft Categories Page and checks if active results are visible
test('draft categories page loads with active results', async ({ page }) => {
  

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();
  await expect(page.getByRole('switch', { name: 'Active' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'ActionCategoryDescriptionLast' }).nth(3)).toBeVisible();

});

// To check existing search result -"Advanced"
test('search existing category advanced', async ({ page }) => {
  

  // await expect(page.getByText('Mailbox Dashboard')).toBeVisible();

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();

  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('textbox', { name: 'Category' }).fill('Advanced');
  await page.getByRole('textbox', { name: 'Category' }).press('Enter');
  await expect(page.getByRole('cell', { name: 'Advanced' })).toBeVisible();

});

// Status - Active
test('filter categories by active status', async ({ page }) => {
  
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();


  await expect(page.getByRole('switch', { name: 'Active' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Active' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Active' }).nth(1)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Active' }).nth(2)).toBeVisible();

});

// Status - Inactive
test('filter categories by inactive status', async ({ page }) => {
  
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();

  await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByRole('cell', { name: 'In Active' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'In Active' }).nth(1)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'In Active' }).nth(2)).toBeVisible();

});

// Add new category
test('add new draft category', async ({ page }) => {
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(__dirname, 'counter.txt');
  let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
  const categoryName = `Harshtest${count}`;

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();


  await page.getByRole('button', { name: 'Add Draft Category' }).click();
  await expect(page.locator('div').filter({ hasText: 'Add Category' }).nth(5)).toBeVisible();
  await expect(page.getByText('CategoryDescriptionStatusActiveCancelSave')).toBeVisible();
  await expect(page.getByRole('switch', { name: 'Status :' })).toBeVisible();
  await page.getByRole('textbox', { name: '* Category :' }).click();
  await page.getByRole('textbox', { name: '* Category :' }).fill(categoryName);
  await page.getByRole('textbox', { name: '* Description :' }).click();
  await page.getByRole('textbox', { name: '* Description :' }).fill('Trial');
  await page.getByRole('switch', { name: 'Status :' }).click();
  await page.getByRole('switch', { name: 'Status :' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Draft Category created successfully.✖')).toBeVisible();

  fs.writeFileSync(filePath, (count + 1).toString());
});

// Add new category - save with empty fields
test('add category with empty fields shows validation', async ({ page }) => {
  
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();


  await page.getByRole('button', { name: 'Add Draft Category' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Please enter category!')).toBeVisible();
  await expect(page.getByText('Please enter description!')).toBeVisible();

});


// Add pre-existing category
test('add pre existing category shows error', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();


  await expect(page.getByRole('cell', { name: 'Anketa validation in demo', exact: true })).toBeVisible();
  await page.waitForTimeout(10000);

  await page.getByRole('button', { name: 'Add Draft Category' }).click();

  await expect(page.locator('div').filter({ hasText: 'Add Category' }).nth(5)).toBeVisible();
  await expect(page.getByText('CategoryDescriptionStatusActiveCancelSave')).toBeVisible();
  await expect(page.getByRole('switch', { name: 'Status :' })).toBeVisible();
  await page.getByRole('textbox', { name: '* Category :' }).click();
  await page.getByRole('textbox', { name: '* Category :' }).fill('Anketa validation in demo');
  await page.getByRole('textbox', { name: '* Description :' }).click();
  await page.getByRole('textbox', { name: '* Description :' }).fill('Pre-Existance check');
  await page.getByRole('switch', { name: 'Status :' }).click();
  await page.getByRole('switch', { name: 'Status :' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Draft Category with the name: Anketa validation in demo already exists. ✖')).toBeVisible();

});

// Add pre-existing category - cancellation - ok
test('cancel add category confirmation', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();

  await page.getByRole('button', { name: 'Add Draft Category' }).click();

  await page.getByRole('textbox', { name: '* Category :' }).fill('Anketa validation in demo');
  await page.getByRole('textbox', { name: '* Description :' }).click();
  await page.getByRole('textbox', { name: '* Description :' }).fill('Pre-Existance check');

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('div').filter({ hasText: 'Do you still want to cancel?' }).nth(5)).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.locator('div').filter({ hasText: 'Manage Draft Categories' }).nth(4)).toBeVisible();
});

// Update category
test('update draft category', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();
  await page.locator('.anticon.anticon-edit > svg').first().click();
  await expect(page.locator('div').filter({ hasText: 'Update Category' }).nth(5)).toBeVisible();
  await expect(page.getByText('CategoryDescriptionUpdated')).toBeVisible();
  await page.getByRole('textbox', { name: '* Description :' }).fill('Updated Description');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('Draft Category updated successfully.✖')).toBeVisible();

});

// To check empty search results
test('search with empty category field', async ({ page }) => {

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();

  await page.getByRole('textbox', { name: 'Category' }).fill('');
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('div').filter({ hasText: 'ActionCategoryDescriptionLast' }).nth(3).click();

});

// to check non existing search results
test('search non existing category shows no data', async ({ page }) => {
  await expect(page.getByText('Mailbox Dashboard')).toBeVisible();

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.getByRole('menuitem', { name: 'Draft Categories' }).click();

  await page.getByRole('textbox', { name: 'Category' }).click();
  await page.getByRole('textbox', { name: 'Category' }).fill('12334ewrddsva');

  await page.getByRole('button', { name: 'search Search' }).click();

  await page.waitForTimeout(10000);
  await expect(page.getByRole('cell', { name: 'No data' })).toBeVisible();

});

