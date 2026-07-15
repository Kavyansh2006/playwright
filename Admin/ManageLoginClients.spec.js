import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
    await login(page);
});

test.describe.configure({ mode: 'serial', retries: 2 });

// Load Manage Login Clients Page and checks if results are visible
test('manage login clients page loads', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'Manage Login Clients' }).click();
    await expect(page.getByRole('heading', { name: 'Manage Login Client Role For' })).toBeVisible();
    await page.locator('div').filter({ hasText: 'Login Client Role IDClient' }).nth(3).click();

});

//Searching existing client name
test('search existing client name', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'Manage Login Clients' }).click();
    const clientName = page.getByRole('textbox', { name: 'Client Name' });
    await clientName.click();
    await clientName.fill('ZeroCAp');
    await clientName.press('Enter');
    await expect(page.getByRole('cell', { name: 'Zerocap' })).toBeVisible({ timeout: 60000 });
});


//Searching non existing client name
test('search non existing client shows no data', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'container Administration' }).click();
    await page.getByRole('menuitem', { name: 'Manage Login Clients' }).click();

    
    await page.getByRole('textbox', { name: 'Client Name' }).click();
    await page.getByRole('textbox', { name: 'Client Name' }).fill('abracadabra');
    await page.getByRole('textbox', { name: 'Client Name' }).press('Enter');
    await expect(page.getByRole('cell', { name: 'No data' })).toBeVisible();

});

