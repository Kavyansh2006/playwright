import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import fs from 'fs';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('add new ticket category', async ({ page }) => {
  const filePath = path.join(__dirname, 'counter.txt');
  let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
  const ticketCategoryName = `Harshtest${count}`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Ticket Categories').click();
  await page.getByRole('button', { name: 'Add Ticket Category' }).click();
  await page.getByRole('textbox', { name: '* Ticket Category :' }).click();
  await page.getByRole('textbox', { name: '* Ticket Category :' }).fill(ticketCategoryName);
  await page.getByRole('spinbutton', { name: '* Display Order :' }).click();
  await page.getByRole('button', { name: 'Decrease Value' }).click();
  await page.getByRole('combobox', { name: '* Category Ownership :' }).click();
  await page.locator('.ant-select-item-option-content').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.locator('div').filter({ hasText: /^Ticket Category created successfully\.$/ }).first()
  ).toBeVisible();
  fs.writeFileSync(filePath, (count + 1).toString());
});

//check for duplicate name
test('add duplicate ticket category shows error', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Ticket Categories').click();
  await page.getByRole('button', { name: 'Add Ticket Category' }).click();
  await page.getByRole('textbox', { name: '* Ticket Category :' }).click();
  await page.getByRole('textbox', { name: '* Ticket Category :' }).fill('Harshtest');
  await page.getByRole('button', { name: 'Decrease Value' }).click();
  await page.getByRole('combobox', { name: '* Category Ownership :' }).click();
  await page.locator('.ant-select-item-option-content').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Ticket Category with the Name')).toBeVisible();
});

//Search feature
test('search ticket category by name', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.locator('span').filter({ hasText: 'Ticket Categories' }).first().click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Harshtest');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('Harshtest1', { exact: true })).toBeVisible();
});

//Select Businesss client
test('filter ticket categories by business client', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.locator('span').filter({ hasText: 'Ticket Categories' }).first().click();
  await page.locator('.ant-select-selection-overflow').click();
  await page.getByText('AI Biotech').click();
  await page.getByText('Alaya Capital').click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('cell', { name: 'test006' }).click();
});

//landing page
test('ticket categories page loads', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Ticket Categories').click();
  await expect(page.getByRole('heading', { name: 'Manage Ticket Categories' })).toBeVisible();
});

//Submit without entering details
test('save ticket category without details shows validation', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Ticket Categories').click();
  await page.getByRole('button', { name: 'Add Ticket Category' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#basic_Name_help')).toContainText('Please enter ticket category');
  await expect(page.locator('#basic_DisplayOrder_help')).toContainText('Please enter display order!');
  await expect(page.locator('#basic_CategoryOwnership_help')).toContainText('Please select Category ownership');
});

//Category ownership feature
test('filter ticket categories by category ownership', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('Ticket Categories').click();
  await page.locator('#ddlCategoryOwnership').click();
  await page.locator('div').filter({ hasText: 'Select Category Ownership' }).nth(5).click();
  await page.locator('div').filter({ hasText: 'Select Category Ownership' }).nth(5).click();
  await expect(page.locator('div').filter({ hasText: 'Select Category Ownership' }).nth(5)).toBeVisible();
  await page.locator('div').filter({ hasText: 'Select Category Ownership' }).nth(5).click();
  await page.getByText('Select Category Ownership').nth(1).click();
  await page.locator('#ddlCategoryOwnership').click();
  await page.locator('div:nth-child(2) > .ant-select-item-option-content').click();
  await expect(page.getByText('Transfer Agency').nth(1)).toBeVisible();
});
