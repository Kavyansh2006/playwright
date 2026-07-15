import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import fs from 'fs';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await login(page);
});

//Landing page
test('color categories page loads', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Color Categories').click();
  await expect(page.getByRole('heading', { name: 'Manage Color Categories' })).toBeVisible();
});

//Add category without name
test('add color category without name shows error', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Color Categories').click();
  await page.getByRole('button', { name: 'Add Color Category' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Please enter color category')).toBeVisible();
});

//Create new colour category
test('create new color category', async ({ page }) => {
  const filePath = path.join(__dirname, 'counter.txt');
  let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
  const categoryName = `Harshtest${count}`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Color Categories').click();
  await page.getByRole('button', { name: 'Add Color Category' }).click();
  await page.getByRole('textbox', { name: '* Color Category :' }).click();
  await page.getByRole('textbox', { name: '* Color Category :' }).fill(categoryName);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Color Category created')).toBeVisible();
  fs.writeFileSync(filePath, (count + 1).toString());
});

//Search colour category
test('search color category by name', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Color Categories').click();
  await page.getByRole('textbox', { name: 'Category Name' }).click();
  await page.getByRole('textbox', { name: 'Category Name' }).fill('Harshtest');
  await page.getByRole('textbox', { name: 'Category Name' }).press('Enter');
  await expect(page.locator('tbody')).toContainText('Harshtest');
});
