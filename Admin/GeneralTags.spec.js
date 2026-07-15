import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
    await login(page);
});

// Load General Tags Page and checks if only active results are visible
test('general tags page loads with active tags', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();
    await page.getByRole('heading', { name: 'Manage General Tags' }).click();
    await expect(page.getByRole('heading', { name: 'Manage General Tags' })).toBeVisible();
    await expect(page.getByRole('switch', { name: 'Active' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'ActionIDTag' }).nth(3)).toBeVisible();
    await expect(page.getByText('Active').nth(2)).toBeVisible();
});


// checks if only In-active results are visible
test('filter tags by inactive status', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();
    await page.getByRole('switch', { name: 'Active' }).click();
    await expect(page.getByRole('switch', { name: 'In Active' })).toBeVisible();
    await page.getByRole('button', { name: 'search Search' }).click();
    await expect(page.getByText('In Active').nth(1)).toBeVisible();
    await expect(page.getByText('In Active').nth(2)).toBeVisible();
    await expect(page.getByText('In Active').nth(3)).toBeVisible();
});

// Search pre existing tag name
test('search existing tag name', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();
    await page.getByRole('textbox', { name: 'Tag Name' }).click();
    await page.getByRole('textbox', { name: 'Tag Name' }).fill('Bank');
    await page.getByRole('button', { name: 'search Search' }).click();
    await expect(page.locator('div').filter({ hasText: 'ActionIDTag' }).nth(3)).toBeVisible();
    await expect(page.getByText('Bank').first()).toBeVisible();
});

// Search non existing tag name
test('search non existing tag shows no data', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();
    await page.getByRole('textbox', { name: 'Tag Name' }).click();
    await page.getByRole('textbox', { name: 'Tag Name' }).fill('sdfd');
    await page.getByRole('button', { name: 'search Search' }).click();
    await expect(page.locator('div').filter({ hasText: 'ActionIDTag' }).nth(3)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'No data' })).toBeVisible();
});

//Add new tag
test('add new tag', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(__dirname, 'counter.txt');
    let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
    const tagName = `Harshtest${count}`;

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();

    await page.getByRole('button', { name: 'Add New Tag' }).click();

    await expect(page.locator('div').filter({ hasText: 'Add Tag' }).nth(5)).toBeVisible();
    await expect(page.getByText('General TagDescriptionStatusActiveCancelSave')).toBeVisible();

    await page.getByRole('textbox', { name: '* General Tag :' }).click();
    await page.getByRole('textbox', { name: '* General Tag :' }).fill(tagName);
    await page.getByRole('textbox', { name: '* General Tag :' }).press('Tab');
    await page.getByRole('textbox', { name: '* Description :' }).fill('Trial');
    await page.getByRole('switch', { name: 'Status :' }).click();
    await page.getByRole('switch', { name: 'Status :' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Tag created successfully.✖')).toBeVisible();

    fs.writeFileSync(filePath, (count + 1).toString());
});

//Add pre existing tag
test('add pre existing tag shows error', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();

    await page.getByRole('button', { name: 'Add New Tag' }).click();

    await page.getByRole('textbox', { name: '* General Tag :' }).click();
    await page.getByRole('textbox', { name: '* General Tag :' }).fill('raiji');
    await page.getByRole('textbox', { name: '* General Tag :' }).press('Tab');
    await page.getByRole('textbox', { name: '* Description :' }).fill('Trial');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('General Tag with the Name: raiji already exists. ✖')).toBeVisible();
});


//Saving with empty fields
test('save tag with empty fields shows validation', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();

    await page.getByRole('button', { name: 'Add New Tag' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Please enter general tag')).toBeVisible();
    await expect(page.getByText('Please enter description!')).toBeVisible();
});


//Update Description
test('update tag description', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.locator('span').filter({ hasText: 'General Tags' }).first().click();

    await page.locator('.anticon.anticon-edit > svg').first().click();
    await page.getByRole('textbox', { name: '* Description :' }).fill('Updated Desc2233'); 
    await page.getByRole('button', { name: 'Update' }).click();
});
