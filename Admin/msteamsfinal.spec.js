import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import fs from 'fs';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await login(page);
});

//create team
test('create new ms team', async ({ page }) => {
  const filePath = path.join(__dirname, 'counter.txt');
  let count = parseInt(fs.readFileSync(filePath, 'utf8'), 10);
  const teamName = `Harshtest${count}`;

  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  await page.getByRole('button', { name: 'Add Team' }).click();
  await expect(page.getByText('Create Team')).toBeVisible();
  await page.getByRole('textbox', { name: 'Team ID' }).click();
  await page.getByRole('textbox', { name: 'Team ID' }).fill(teamName);
  await page.getByRole('textbox', { name: 'Team Name', exact: true }).click();
  await page.getByRole('textbox', { name: 'Team Name', exact: true }).fill(teamName);
  await page.getByRole('textbox', { name: 'Team Description' }).click();
  await page.getByRole('textbox', { name: 'Team Description' }).fill(teamName);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Team created successfully.')).toBeVisible();
  fs.writeFileSync(filePath, (count + 1).toString());
});

//Duplicate team
test('create duplicate team shows error', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  await page.getByRole('button', { name: 'Add Team' }).click();
  await page.getByRole('textbox', { name: 'Team ID' }).click();
  await page.getByRole('textbox', { name: 'Team ID' }).fill('5');
  await page.getByRole('textbox', { name: 'Team Name', exact: true }).click();
  await page.getByRole('textbox', { name: 'Team Name', exact: true }).fill('5');
  await page.getByRole('textbox', { name: 'Team Description' }).click();
  await page.getByRole('textbox', { name: 'Team Description' }).fill('5');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Team with the Name: 5 already exists. ✖')).toBeVisible();
});

//Search team
test('search team by name', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  await page.getByRole('textbox', { name: 'Enter Team Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Team Name' }).fill('5');
  await page.getByRole('textbox', { name: 'Enter Team Name' }).press('Enter');
  await expect(page.getByRole('gridcell', { name: '5' }).first()).toBeVisible();
});

test('update existing team', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  const searchBox = page.getByRole('textbox', { name: 'Enter Team Name' });
  await searchBox.fill('5');
  await searchBox.press('Enter');
  await page.locator('.anticon-edit').first().waitFor();
  await page.locator('.anticon-edit').first().click();
  await page.getByRole('button', { name: 'Update' }).waitFor();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('Team updated successfully.')).toBeVisible();
});

test('add channel to team', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  await expect(page.getByRole('gridcell', { name: '5' }).nth(1)).toBeVisible();
  await page.locator('.anticon.anticon-plus-square > svg > path').first().click();
  await page.getByRole('textbox', { name: 'Channel ID' }).click();
  await page.getByRole('textbox', { name: 'Channel ID' }).fill('5');
  await page.getByRole('textbox', { name: 'Channel Name', exact: true }).click();
  await page.getByRole('textbox', { name: 'Channel Name', exact: true }).fill('55');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Channel created/updated')).toBeVisible();
});

test('search channel by name', async ({ page }) => {
  await page.getByText('Administration').click();
  await page.waitForTimeout(5000);
  await page.getByText('MS Teams').click();
  await page.getByRole('textbox', { name: 'Enter Channel Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Channel Name' }).fill('5');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByRole('gridcell', { name: '5' }).first()).toBeVisible();
  await page.getByRole('gridcell', { name: '41' }).click();
});
