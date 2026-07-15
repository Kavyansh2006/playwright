import { test, expect } from '@playwright/test';
import { login } from './utils/login';

test.beforeEach(async ({ page }) => {
  await login(page);
});

//on opening the General Folder Rules
test('general folder rules page loads', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();
 await expect(page.getByRole('heading', { name: 'Manage General Folder Rules' })).toBeVisible();
});

//by default ABC is selected in the dropdown
test('abc selected by default in mailbox dropdown', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();
 
 await page.getByText('ABC', { exact: true }).click();
 await expect(page.locator('#root').getByText('ABC', { exact: true })).toBeVisible();
});

//on selecting any option from dropdown
test('search folder rules by mailbox selection', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();
 
  await page.locator('#root').getByText('ABC', { exact: true }).click();
  await page.getByText('AccountingClient', { exact: true }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  
await expect(
  page.getByText('Accountingclientmailbox01@').first()
).toBeVisible();

});

//if writing the folder name which does not exist 
test('search non existing mailbox shows no data', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

await page.getByText('ABC', { exact: true }).click();
  await page.locator('#root').getByText('ABC', { exact: true }).click();
  await page.locator('#ddlMailboxes').fill('kavyansh');
  await expect(page.locator('#ddlMailboxes_list')).toContainText('No data');
});


//searching with the "mail from address" that exists for the particular MailBox
test('search by existing mail from address', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

 await page.getByRole('textbox', { name: 'Mail From Address' }).click();
 await page.getByRole('textbox', { name: 'Mail From Address' }).fill('test1@mail.com');
 await page.getByRole('button', { name: 'search Search' }).click();
 await expect(page.getByText('test1@mail.com').first()).toBeVisible();
});

//searching in the "mail from address" that does not exist or is not from the particulat MailBox which is selected
test('search by non existing mail from address', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

await expect(page.getByText('ABC', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Mail From Address' }).click();
  await page.getByRole('textbox', { name: 'Mail From Address' }).fill('kavy@mail.com');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.locator('#root').getByText('No data')).toBeVisible();
});

//searching with the correct subject that exists for the correct MailBox
test('search by mail subject', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

 await page.locator('#root').getByText('ABC', { exact: true }).click();
  await page.getByText('Accounting', { exact: true }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'Mail Subject' }).click();
  await page.getByRole('textbox', { name: 'Mail Subject' }).fill('testing mail memory');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('testing mail memory')).toBeVisible();
});

//searching with the status as Active  with the condition that mailBox have the active status item
test('filter folder rules by active status', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

await expect(page.getByRole('switch', { name: 'Active' })).toBeVisible();
  await expect(page.getByText('Active').nth(2)).toBeVisible();
});

//searching with the status as InActive with the condition that mailBox have the Inactive status item
test('filter folder rules by inactive status with results', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

  await page.locator('#root').getByText('ABC', { exact: true }).click();
  await page.getByText('AccountingClient', { exact: true }).click();
  await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.locator('tbody').getByText('In Active')).toBeVisible();
});

//searching with the status as Inactive with the condition that mailBox does not have the Inactive status item
test('filter inactive status with no data', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

 await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('No data')).toBeVisible();
});

//click on Add General Folder Rules
test('open add general folder rule modal', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

await page.getByRole('button', { name: 'Add General Folder Rule' }).click();
  await expect(page.getByLabel('Add General Folder Rule').getByText('Add General Folder Rule')).toBeVisible();
});

//fill all the fields which are unique from which are already created and click on save
// test('test12', async ({ page }) => {
//  await page.getByText('Administration').click();
//  await page.getByText('General Folder Rules').click();

//  await page.getByRole('button', { name: 'Add General Folder Rule' }).click();
// await page.getByRole('combobox', { name: '* Mailbox :' }).click();
//   await page.getByRole('combobox', { name: '* Mailbox :' }).fill('AccountingClient');
//   await page.getByRole('combobox', { name: '* Mailbox :' }).press('Enter');
//   await page.getByRole('textbox', { name: '* Mail From :' }).click();
//   await page.getByRole('textbox', { name: '* Mail From :' }).fill('kavmi@mail.com');
//   await page.getByRole('textbox', { name: 'Subject :' }).click();
//   await page.getByRole('textbox', { name: 'Subject :' }).fill('testing Accounting client');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await expect(page.getByText('General Folder Rule created')).toBeVisible();
// });

//click on save button without filling mandatory the fields
test('save folder rule without mandatory fields shows validation', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

await page.getByRole('button', { name: 'Add General Folder Rule' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Choose the mailbox option.')).toBeVisible();
  await expect(page.getByText('Please enter Mail Address')).toBeVisible();
});

//fill the all the field similar to which are already created
 test('add duplicate folder rule shows error', async ({ page }) => {
 await page.getByText('Administration').click();
 await page.getByText('General Folder Rules').click();

 await page.getByRole('button', { name: 'Add General Folder Rule' }).click();
await page.getByRole('combobox', { name: '* Mailbox :' }).click();
  await page.getByRole('combobox', { name: '* Mailbox :' }).fill('ABC');
  await page.getByRole('combobox', { name: '* Mailbox :' }).press('Enter');
  await page.getByRole('textbox', { name: '* Mail From :' }).click();
  await page.getByRole('textbox', { name: '* Mail From :' }).fill('kav@mail.com');
  await page.getByRole('textbox', { name: 'Subject :' }).click();
  await page.getByRole('textbox', { name: 'Subject :' }).fill('testing abc');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('General Folder Rule cannot be')).toBeVisible();
 });