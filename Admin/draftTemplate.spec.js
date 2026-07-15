import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
  await login(page);
});

//Draft Templates page loads
test('draft templates page loads', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await expect(
    page.getByRole('heading', { name: 'Manage Draft Templates' })
  ).toBeVisible();
});

//Advanced on the dropdown
test('advanced option selected by default in dropdown', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await expect(page.getByRole('main')).toContainText('Advanced');
});

//searching for some other option dropdown
test('search draft templates with empty category', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await page.locator('#root').getByText('Advanced').click();
  await page.getByText('Beginner1').click();
  await expect(page.getByText('No data')).toBeVisible();
});

//searching for some other option dropdown which has some data
test('search draft templates with data category', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await page.locator('#root').getByTitle('Advanced').click();
  await page.getByText('Bread', { exact: true }).click();
  await expect(page.getByText('Template', { exact: true })).toBeVisible();
});

//To check the Active status 
test('filter draft templates by active status', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('switch', { name: 'In Active' }).click();
  await expect(page.getByText('Active').nth(2)).toBeVisible();
});

//click on add draft template button
test('open add draft template modal', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await page.getByRole('button', { name: 'Add Draft Template' }).click();
  await expect(page.getByRole('heading', { name: 'Add Template' })).toBeVisible();
});

//saving the template without filling any field
test('save draft template without fields shows validation', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  await page.getByRole('button', { name: 'Add Draft Template' }).click();

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Please fill Template')).toBeVisible();
});

//writing the data which already exists in the add template
test('save draft template without content shows validation', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Draft Templates').click();

  await page.getByRole('button', { name: 'Add Draft Template' }).click();
  await page.getByRole('textbox', { name: 'Template' }).fill('testing1');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('testing1');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Please fill Content')).toBeVisible();
});

//testing for file attachment button
test('open attach file dialog', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  
  await page.getByRole('button', { name: 'Add Draft Template' }).click();
  await page.getByRole('button', { name: 'upload Attach File Items' }).click();
  await expect(page.getByText('File Explorer')).toBeVisible();
});

//clicking OK without selecting any file
test('attach file without selection shows error', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.getByText('Draft Templates').click();

  
  await page.getByRole('button', { name: 'Add Draft Template' }).click();
  await page.getByRole('button', { name: 'upload Attach File Items' }).click();

  await page.getByRole('button', { name: 'Ok' }).click();
  await expect(page.getByText('Please select file(s)')).toBeVisible();
  
});

//adding a new template
// test('test11', async ({ page }) => {
//   await page.getByText('Administration').click();
//   await page.getByText('Draft Templates').click();

  
//   await page.getByRole('button', { name: 'Add Draft Template' }).click();
//   await page.getByText('Advanced').click();
//   await page.locator('#root').getByText('Advanced').click();
//   await page.locator('#categoryID').fill('testingk');
//   await page.getByText('testingk').click();
//   await page.getByRole('textbox', { name: 'Template' }).click();
//   await page.getByRole('textbox', { name: 'Template' }).fill('t3');
//   await page.getByRole('textbox', { name: 'Description' }).click();
//   await page.getByRole('textbox', { name: 'Description' }).fill('t3');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await page.locator('iframe[title="Rich Text Area"]').contentFrame().locator('html').click();
//   await page.locator('iframe[title="Rich Text Area"]').contentFrame().getByLabel('Rich Text Area. Press ALT-0').fill('hello testing t2');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await expect(page.getByText('Template created successfully.')).toBeVisible();
// }
//);