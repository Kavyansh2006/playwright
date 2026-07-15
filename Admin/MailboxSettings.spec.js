import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
    await login(page);
});

// Load General Tags Page and checks if only active results are visible
test('mailbox settings page loads', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();

    await expect(page.getByRole('heading', { name: 'Manage MailBox Settings' })).toBeVisible();

    await expect(page.locator('div').filter({ hasText: 'ActionIDMailBox IDDisplay' }).nth(3)).toBeVisible();
});

//Search results for selected mailbox
test('search results by selected mailbox', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();

    await page.locator('div').filter({ hasText: /^Select Mailbox$/ }).nth(2).click();

    await page.getByText('AccountingClient03', { exact: true }).click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await expect(page.getByRole('cell', { name: 'AccountingClient03' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'AccountingClient03' }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'AccountingClient03' }).nth(2)).toBeVisible();
});

//Search results for selected client
test('search results by selected client', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();

    await page.locator('div').filter({ hasText: /^Select Client$/ }).nth(2).click();
    await page.getByText('0-Edge').nth(1).click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await expect(page.getByRole('cell', { name: '0-Edge' }).first()).toBeVisible();

    await page.getByRole('textbox', { name: 'abc@navbackoffice.com' }).fill('abc@navbackoffice.com');
    await expect(page.getByRole('cell', { name: 'abc@navbackoffice.com' }).nth(1)).toBeVisible();
});


//Search results for client mailbox
test('search results by client mailbox', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();

    await page.getByRole('textbox', { name: 'abc@navbackoffice.com' }).click();
    await page.getByRole('textbox', { name: 'abc@navbackoffice.com' }).fill('ravi@navbackoffice.com');
    await page.getByRole('textbox', { name: 'abc@navbackoffice.com' }).press('Enter');

    await expect(page.getByRole('cell', { name: 'ravi@navbackoffice.com' }).nth(1)).toBeVisible();
});


//Add new Client mailbox
test('add new client mailbox', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(__dirname, 'counter.txt');
    let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
    const clientMailbox = `Harshtest${count}@navbackoffice.com`;

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();


    await page.getByRole('button', { name: 'Add MailBox Settings' }).click();


    await page.getByText('Select MailBox', { exact: true }).click();
    await page.locator('div').filter({ hasText: /^ABC$/ }).first().click();

    await page.getByLabel('Add MailBox Settings').getByText('Select Client').click();
    await page.locator('#ddlClient').fill('05 Capital Advisors');
    await page.locator('#ddlClient').press('Enter');

    await page.getByRole('textbox', { name: 'Enter Client MailBox' }).click();
    await page.getByRole('textbox', { name: 'Enter Client MailBox' }).fill(clientMailbox);

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('MailBox Setting created successfully.✖')).toBeVisible();

    fs.writeFileSync(filePath, (count + 1).toString());
});


//Add prexisting Client mailbox
test('add pre existing client mailbox shows error', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'MailBox Settings' }).click();


    await page.getByRole('button', { name: 'Add MailBox Settings' }).click();


    await page.getByText('Select MailBox', { exact: true }).click();
    await page.locator('div').filter({ hasText: /^ABC$/ }).first().click();


    await page.getByLabel('Add MailBox Settings').getByText('Select Client').click();
    await page.locator('#ddlClient').fill('05 Capital Advisors');
    await page.locator('#ddlClient').press('Enter');

    await page.getByRole('textbox', { name: 'Enter Client MailBox' }).click();
    await page.getByRole('textbox', { name: 'Enter Client MailBox' }).fill('ravi1@navbackoffice.com');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('div').filter({ hasText: 'Mailbox setting already' }).nth(3)).toBeVisible();
});

