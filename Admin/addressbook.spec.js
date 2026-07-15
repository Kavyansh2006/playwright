import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import fs from 'fs';
import path from 'path';

// Counter file rakhta hai taaki har run mein unique contact bane
const counterPath = path.join(__dirname, 'addressCounter.txt');
function readCount() {
  return parseInt(fs.readFileSync(counterPath, 'utf8'), 10);
}

// Serial: create test pehle chale, baaki verify tests usi naye contact par chalein
test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await login(page);
});

// Naya unique contact banata hai aur counter +1 kar deta hai
test('create new contact', async ({ page }) => {
  const count = readCount();
  const email = `Harshit${count}@navbackoffice.com`;

  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.waitForTimeout(10000);
  await page.locator('span').filter({ hasText: 'Address Book' }).first().click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).fill(`Harshit${count}`);
  await page.getByRole('textbox', { name: 'Last Name :' }).click();
  await page.getByRole('textbox', { name: 'Last Name :' }).fill('Gurjar');
  await page.getByRole('textbox', { name: '* Email :' }).click();
  await page.getByRole('textbox', { name: '* Email :' }).fill(email);
  await page.locator('.ant-select-selection-item').click();
  await page.getByText('Personal').nth(3).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Contact created successfully.')).toBeVisible();

  fs.writeFileSync(counterPath, (count + 1).toString());
});

test('address book page loads', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await expect(page.getByRole('heading')).toContainText('Manage Address Book - Internal');
});

test('open add contact modal', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.waitForTimeout(10000);
  await page.locator('span').filter({ hasText: 'Address Book' }).first().click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await expect(page.locator('#rc_unique_0')).toContainText('Add Contact');
});

test('add contact without email shows required error', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'container Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#basic_Email_help')).toContainText('\'Email\' is required');
  await page.getByRole('button', { name: 'Save' }).click();
});

// Duplicate check: jo contact abhi bana usi email se dobara banane par error aana chahiye
test('add duplicate contact email shows error', async ({ page }) => {
  const email = `Harshit${readCount() - 1}@navbackoffice.com`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).fill('Harsh');
  await page.getByRole('textbox', { name: 'Last Name :' }).click();
  await page.getByRole('textbox', { name: 'Last Name :' }).fill('Test');
  await page.getByRole('textbox', { name: '* Email :' }).click();
  await page.getByRole('textbox', { name: '* Email :' }).fill(email);
  await page.locator('.ant-select-selection-item').click();
  await page.getByText('Personal').nth(3).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText(`Contact with the Email: ${email} already exists.`);
});

// Search + edit: abhi banaye gaye contact ko dhoond kar edit karo
test('search contact by email and edit', async ({ page }) => {
  const email = `Harshit${readCount() - 1}@navbackoffice.com`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Email' }).press('Enter');
  await expect(page.getByRole('cell', { name: email })).toBeVisible();
  await page.locator('.anticon.anticon-edit > svg').first().click();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.locator('div').filter({ hasText: /^Contact updated successfully\.$/ }).first()).toBeVisible();
});

test('filter contacts by inactive status', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByRole('cell', { name: 'In Active' }).first()).toBeVisible();
});

// Search exact email: abhi banaye gaye contact ka email dikhna chahiye
test('search contact by exact email', async ({ page }) => {
  const email = `Harshit${readCount() - 1}@navbackoffice.com`;

  await page.getByRole('menuitem', { name: 'Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByRole('cell', { name: email })).toBeVisible();
});

test('add contact with invalid email domain shows error', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'Administration' }).click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).click();
  await page.getByRole('textbox', { name: 'First Name :' }).fill('harsh');
  await page.getByRole('textbox', { name: 'Last Name :' }).click();
  await page.getByRole('textbox', { name: 'Last Name :' }).fill('g');
  await page.getByRole('textbox', { name: '* Email :' }).click();
  await page.getByRole('textbox', { name: '* Email :' }).fill('harsh@gmail.com');
  await page.locator('.ant-select-selection-item').click();
  await page.getByText('Personal').nth(3).click();
  await expect(page.getByRole('alert')).toContainText('Email Address should not be other than navbackoffice.com, navfundservices.com and navconsulting.net domain');
});

// Search + edit (dusra flow): abhi banaye gaye contact par
test('search contact and update details', async ({ page }) => {
  const email = `Harshit${readCount() - 1}@navbackoffice.com`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(10000);
  await page.getByText('Address Book').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Email' }).press('Enter');
  await expect(page.getByText(email)).toBeVisible();
  await page.locator('.anticon.anticon-edit > svg').first().click();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('Contact updated successfully.')).toBeVisible();
});
