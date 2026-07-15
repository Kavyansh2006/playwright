import { test, expect } from '@playwright/test';
import { login } from '../Admin/utils/login';
test.describe.configure({ retries: 3 });
test.beforeEach(async ({ page } , testInfo) => {
await login(page);
});

//Load ticket Dashboard
test('ticket dashboard loads with ticket rows', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await expect(page.getByText('Ticket Dashboard')).toBeVisible();

  // Wait for any ticket row (text-based, reliable)
  const rows = page.locator('text=/FA-\\d+/');

  await expect(rows.first()).toBeVisible();
});


//Dashboard search appky
test('search tickets by subject with shortcut', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('Test mail');
  await page.getByRole('textbox', { name: 'Subject' }).press('Alt+s');
  await expect(page.getByText('Test mail').first()).toBeVisible();
});


//Open Advanced Search Drawer
test('open advanced search drawer with shortcut', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await expect(page.getByText('Search').first()).toBeVisible();
});


//Search returns empty list
test('search tickets with no match returns no data', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('ZZZ_NO_MACTH');
   await page.getByRole('textbox', { name: 'Subject' }).press('Enter');
  await expect(page.getByText('No data')).toBeVisible();
});


//Advanced Search + Regular Search Combined
test('combine advanced client filter with subject search', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('.ant-col.ant-col-17 > .input-btn-group > .ant-select > .ant-select-selector').first().click();
  await page.locator('#clientID').fill('Alaya Capital');
  await page.locator('#clientID').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('Test mail');
   await page.getByRole('textbox', { name: 'Subject' }).press('Enter');
  await expect(page.getByText('Test mail').first()).toBeVisible();
  await expect(page.getByText('Alaya Capital').first()).toBeVisible();
});


//Filter by Client
test('filter tickets by client BE Capital', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
 await page.locator('.ant-col.ant-col-17 > .input-btn-group > .ant-select > .ant-select-selector').first().click();
  await page.locator('#clientID').fill('BE Capital');
  await page.locator('#clientID').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('BE Capital').first()).toBeVisible();
});


//Filter by ticket status
test('filter tickets by pending status', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('div:nth-child(14) > .ant-select > .ant-select-selector').click();
  await page.getByRole('dialog').locator('#ddlStatus').fill('Pending');
  await page.getByRole('dialog').locator('#ddlStatus').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Pending').first()).toBeVisible();
});


//Filter by ticket type
test('filter tickets by regular type', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('div:nth-child(12) > .ant-select > .ant-select-selector').click();
  await page.locator('#ddlTicketType').fill('Regular');
  await page.locator('#ddlTicketType').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
 await page.locator('div:nth-child(5) > .color-indicator').first().click();
  await expect(page.getByRole('tooltip', { name: 'Regular' })).toBeVisible();
  await expect(page.locator('.color-indicator.green').first()).toBeVisible();
});


//Filter by ticket ID
test('filter tickets by ticket id 81656', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  const ticketInput = page.getByRole('textbox', { name: 'Ticket No.' });
  await ticketInput.click();
  await ticketInput.fill('81656');
  await ticketInput.press('Alt+s');
  const rows = page.locator('text=/FA-81656/');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toBeVisible();
});


//Filter by subject
test('filter tickets by subject Testing 007', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('Testing 007');
  await page.getByRole('textbox', { name: 'Subject' }).press('Alt+s');
  await expect(page.getByText('Testing').first()).toBeVisible();
});


//Filter by mailbox
test('filter tickets by ABC mailbox', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('div').filter({ hasText: /^Select Mailbox$/ }).nth(2).click();
  await page.locator('#mailbox').fill('ABC');
  await page.locator('#mailbox').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'menu-fold' }).click();
  await expect(page.getByRole('gridcell', { name: 'abc@navbackoffice.com' }).first()).toBeVisible();});


//Filter by business Client
test('filter tickets by business client Alaya Capital', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('.ant-col.ant-col-17 > .input-btn-group > .ant-select > .ant-select-selector').first().click();
  await page.locator('#clientID').fill('Alaya Capital');
  await page.locator('#clientID').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Alaya Capital').first()).toBeVisible();
});


//Filter by fund
test('filter tickets by fund Ausbiz Capital Growise', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('.ant-col.ant-col-17 > .input-btn-group > .ant-select > .ant-select-selector').first().click();
  await page.locator('#clientID').fill('AUSBIZ');
  await page.locator('#clientID').press('Enter');
  await page.locator('div').filter({ hasText: /^Fund:$/ }).click();
  await page.locator('div:nth-child(8) > .input-btn-group > .ant-select > .ant-select-selector').click();
  await page.locator('#fundID').fill('Ausbiz Capital Growise');
  await page.locator('#fundID').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.locator('.anticon.anticon-more > svg').first().click();
  await page.getByRole('menuitem', { name: 'View Ticket' }).click();
  await expect(page.getByText('Ausbiz Capital Growise')).toBeVisible();
});


//Filter by General Tags
test('filter tickets by general tag KavTest', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('.ant-select.w-75 > .ant-select-selector').click();
  await page.locator('#ddlGeneralTags').fill('KavTest');
  await page.locator('#ddlGeneralTags').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('button', { name: 'menu-fold' }).click();
  await page.locator('.anticon.anticon-more > svg').first().click();
  await page.getByRole('menuitem', { name: 'View Ticket' }).click();
  await expect(page.getByText('KavTest')).toBeVisible();
});


//Filter assigned tickets
test('filter assigned tickets returns results', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');

  await page.locator('div')
    .filter({ hasText: /^Select Assigned or Unassigned$/ })
    .nth(2)
    .click();

  await page.locator('#assigned').fill('Assigned');
  await page.getByTitle('Assigned', { exact: true }).click();

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  //  Use real row pattern (ticket IDs)
  const rows = page.locator('text=/FA-\\d+/');

  //  Proper wait for results to appear
  await expect(rows.first()).toBeVisible();

  //  Assert count > 0
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);
});


//Filter by ticket category
test('filter tickets by category test001', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.multi-dropdown-responsive > .ant-select > .ant-select-selector').first().click();
  await page.locator('#ddlTicketCategories').fill('test001');
  await page.locator('#ddlTicketCategories').press('Enter');
  await page.getByRole('button', { name: 'sync' }).first().click();
  await page.getByRole('button', { name: 'sync' }).first().press('Alt+s');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await expect(page.getByText('test001').first()).toBeVisible();
});


//Filter by ticket mail status
test('filter tickets by resolved mail status', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.ant-select.w-100.ant-select-multiple > .ant-select-selector').first().click();
  await page.locator('#ddlStatus').fill('Resolved');
  await page.locator('#ddlStatus').press('Enter');
  await page.getByRole('button', { name: 'sync' }).first().press('Alt+s');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await expect(page.getByText('Resolved')).toBeVisible();
});


//Filter by ticket mail ID
test('filter tickets by ticket mail id 330218', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330218');
    await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await expect(page.getByText('330218')).toBeVisible();
});


//Filter by Email Address
test('filter tickets by email address', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.getByRole('textbox', { name: 'Email (From/To/Cc/Bcc)' }).click();
  await page.getByRole('textbox', { name: 'Email (From/To/Cc/Bcc)' }).fill('testonshoreforrta@navbackoffice.com');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('button', { name: 'down' }).click();
  await expect(page.getByText('TestOnshoreForRTA@navbackoffice.com', { exact: true }).first()).toBeVisible();
});


//Filter has Conversation = Yes
test('filter tickets with bad conversation yes', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');

  await page.locator('div').filter({ hasText: /^Select$/ }).nth(2).click();
  await page.locator('#ddIBadConversation').fill('Yes');
  await page.locator('#ddIBadConversation').press('Enter');

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  const rows = page.locator('text=/FA-\\d+/');
  const noDataText = page.getByText('No data');

  // Wait for either result
  await Promise.race([
    rows.first().waitFor({ state: 'visible' }),
    noDataText.waitFor({ state: 'visible' })
  ]);

  if (await noDataText.isVisible()) {
    // No data case
    await expect(noDataText).toBeVisible();
  } else {
    // Data present case
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  }

  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await expect(page.getByRole('cell', { name: 'flag' })).toBeVisible();
});



//Filter by Feedback = Yes
test('filter tickets with feedback yes', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');

  await page.locator('div').filter({ hasText: /^Select$/ }).nth(5).click();
  await page.locator('#ddIFeedback').fill('Yes');
  await page.locator('#ddIFeedback').press('Enter');

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  const rows = page.locator('text=/FA-\\d+/');
  const noDataText = page.getByText('No data');

  // Wait for either rows OR "No data"
  await Promise.race([
    rows.first().waitFor({ state: 'visible' }),
    noDataText.waitFor({ state: 'visible' })
  ]);

  if (await noDataText.isVisible()) {
    // Case 1: No records
    await expect(noDataText).toBeVisible();
  } else {
    // Case 2: Records exist
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  }
});


//Filter by Sensitivity
test('filter tickets by sensitivity none', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('div:nth-child(28) > .ant-select > .ant-select-selector').click();
  await page.locator('#ddlSensitivity').fill('None');
  await page.locator('#ddlSensitivity').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 11');
  await page.getByRole('textbox', { name: 'Subject' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'edit' }).first().click();
  await expect(page.locator('div').filter({ hasText: /^None$/ }).nth(2)).toBeVisible();
});


//Filter CSR allocation
test('filter tickets with CSR user allocation enabled', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');

  await page.getByRole('checkbox', { name: 'Enable CSR User Allocation' }).check();

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Stable AG Grid row locator
  const rows = page.locator('.ag-center-cols-container .ag-row');

  // Wait for at least one row
  await expect(rows.first()).toBeVisible();

  // Assert rows > 0
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);
});


//Filter by Allocated User
test('filter tickets by allocated user tanujsh', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.getByRole('checkbox', { name: 'Enable CSR User Allocation' }).check();

  await page.locator('div:nth-child(3) > .ant-select > .ant-select-selector').click();
  await page.locator('#allocatedUserName').fill('tanujsh');
  await page.locator('#allocatedUserName').press('Enter');

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await page.locator('.ant-select.w-100 > .ant-select-selector').first().click();
  await page.locator('#ddlStatus').fill('Pending');
  await page.locator('#ddlStatus').press('Enter');
await page.locator('#ddlStatus').press('Alt+s');

  await page.waitForTimeout(2000);

  await page.keyboard.press('Shift+V');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Shift+V');

// Open User Allocation tab
 await page.getByRole('tab', { name: 'User Allocation' }).click();
  await expect(page.locator('div:nth-child(21) > .ant-col.ant-col-18')).toBeVisible();

});




test('filter tickets by client CV PC and pending status', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('button', { name: 'filter' }).click();
    await page.locator('div:nth-child(2) > .ant-select-selector > .ant-select-selection-overflow').first().click();
    await page.locator('#clientID').fill('CV PC');
    await page.locator('#clientID').press('Enter');
    await page.locator('div').filter({ hasText: /^Status:$/ }).click();
    await page.locator('div:nth-child(14) > .ant-select > .ant-select-selector').click();
    await page.getByRole('dialog').locator('#ddlStatus').fill('Pending');
    await page.getByRole('dialog').locator('#ddlStatus').press('Enter');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('.color-indicator').first().click();
    await expect(page.getByRole('tooltip')).toContainText('Pending');
    await page.getByText('CV PC').first().click();
});

test('filter Asian clients', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.ant-select.w-100.client-category > .ant-select-selector').click();
  await page.locator('#ddlClientCategories').fill('Asian');
  await page.locator('#ddlClientCategories').press('Enter');
  await page.locator('#ddlClientCategories').press('Alt+s');
});


test('filter tickets by category ownership transfer agency', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('button', { name: 'filter' }).click();
    await page.locator('#ddlCategoryOwnership').click();
    await page.getByText('Transfer Agency').click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
});
test('add edit and delete custom view customView001', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('button', { name: 'filter' }).click();
    await page.locator('label').filter({ hasText: 'Neutral' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill("customView001");
    await page.getByRole('button', { name: 'Save' }).click();


    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Edit Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('customView001-edited');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByText('Custom View updated successfully✖')).toBeVisible();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();

});
test('filter unassigned tickets', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('button', { name: 'filter' }).click();
    await page.getByText('Select Assigned or Unassigned').click();
    await page.getByTitle('Unassigned', { exact: true }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
});

test('ticket id non numeric shows validation error', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('s');
    await expect(page.getByText('There can only be numerical values. ✖')).toBeVisible();
});

test('clear dashboard filters restores pending status', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await expect(page.locator('#ticket-list-scroll')).toContainText('Pending Da...');
    await page.locator('.ant-select-selection-overflow').first().click();

    await page.locator('#ddlStatus').fill('Resolved');
    await page.locator('#ddlStatus').press('Enter');

  await page.locator('#ddlStatus').press('Alt+s');
    await expect(page.locator('#ticket-list-scroll')).toContainText('Resolved...');
    await page.getByRole('button', { name: 'delete' }).click();
    await expect(page.locator('#ticket-list-scroll')).toContainText('Pending Da...');
});

test('add custom view with neutral filter and delete', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('button', { name: 'filter' }).click();
    await page.locator('label').filter({ hasText: 'Neutral' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill("customV");
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Custom View added successfully✖')).toBeVisible();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();
});



test('create and delete custom view to be deleted', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('button', { name: 'filter' }).click();
    await page.locator('label').filter({ hasText: 'Neutral' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('to be deleted');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();
});

test('switch between saved custom views 1234 and 987', async ({ page }) => {

    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.locator('#root').getByText('Blank View').click();
    await page.locator('#ddlCustomView').fill('1234');
    await page.locator('#ddlCustomView').press('Enter');
    await page.locator('div').filter({ hasText: 'Ticket Dashboard' }).nth(4).click();
    await expect(page.locator('div').filter({ hasText: /^1234$/ }).nth(2)).toBeVisible();
    await page.waitForTimeout(2000);
    await page.locator('#root').getByText('1234').click();
    await page.locator('#ddlCustomView').fill('987');
    await page.locator('#ddlCustomView').press('Enter');
});





//Reset filters via Blank View
test('clear filters restores original ticket list', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  const rows = page.locator('text=/FA-\\d+/');

  //  Wait for initial data
  await expect(rows.first()).toBeVisible();

  //  Capture initial state (count + first ticket)
  const initialCount = await rows.count();
  const initialFirstTicket = (await rows.first().textContent()).trim();

  //  Apply filter
  await page.getByRole('button', { name: 'filter' }).click();
  await page.locator('div').filter({ hasText: /^Select$/ }).nth(2).click();
  await page.locator('#ddIBadConversation').fill('Yes');
  await page.locator('#ddIBadConversation').press('Enter');
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  //  Wait for filtered data
  await expect(rows.first()).toBeVisible();

  const filteredCount = await rows.count();
  const filteredFirstTicket = (await rows.first().textContent()).trim();

  //  Assert data changed
  expect(filteredCount).not.toBe(initialCount);
  expect(filteredFirstTicket).not.toBe(initialFirstTicket);

  //  Remove filter (restore view)
  await page.getByRole('button', { name: 'delete' }).click();

  //  Wait for restored data
  await expect(rows.first()).toBeVisible();

  const finalCount = await rows.count();
  const finalFirstTicket = (await rows.first().textContent()).trim();

  //  Assert original data restored
  expect(finalCount).toBe(initialCount);
  expect(finalFirstTicket).toBe(initialFirstTicket);
});

//Block edit/delete Blank View
test('block edit and delete blank view', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Edit Custom View' }).click();
  await page.waitForTimeout(2000);
    await expect(page.getByText('"Blank View" Cannot Be Modified')).toBeVisible();
  // await expect(page.getByRole('alert')).toContainText('"Blank View" Cannot Be Modified');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
  // await expect(page.getByRole('alert')).toContainText('"Blank View" Cannot Be Removed');
   await page.waitForTimeout(2000);
   await expect(page.getByText('"Blank View" Cannot Be Removed')).toBeVisible();
});


//custom view title validation
test('custom view title special characters and length validation', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  // await page.locator('div').filter({ hasText: /^Blank View$/ }).nth(2).click();
  await expect(page.locator('#root').getByText('Blank View')).toBeVisible();
  await page.locator('#ddlCustomView').fill('testing');
  await page.getByTitle('testing', { exact: true }).click();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('@@@');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Custom View Title should not contain only special characters.')).toBeVisible();
   await page.waitForTimeout(5000);
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('thetitlecannotbegreaterthanthirtycharacters');
  await page.getByRole('button', { name: 'Save' }).click();
  // await expect(page.getByRole('alert')).toContainText('Custom View Title may contain up to 30 characters.');
   await expect(page.getByText('Custom View Title may contain up to 30 characters.')).toBeVisible();
});


// Delete default custom view
test('delete custom view resets to blank view', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
 await page.locator('#root').getByTitle('Blank View').click();
  await page.locator('#ddlCustomView').fill('testing');
  await page.getByTitle('testing', { exact: true }).click();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('defaultView');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Custom View added successfully')).toBeVisible();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
 await expect(page.locator('div').filter({ hasText: /^Blank View$/ }).nth(2)).toBeVisible();

});

//Invalid ticket type for custom view
test('invalid ticket type filter shows no data', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Alt+a');
  await page.locator('div:nth-child(12) > .ant-select > .ant-select-selector').click();
  await page.locator('#ddlTicketType').fill('test');
//   await expect(page.getByText('No data')).toBeVisible();
  await expect(page.locator('.ant-empty-img-simple')).toBeVisible();
});


//duplicate custom view name
test('duplicate custom view name shows error', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Blank View$/ }).nth(2).click();
  await page.locator('#ddlCustomView').fill('testing');
  await page.getByTitle('testing', { exact: true }).click();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('testing');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('User Preference For Ticket Dashboard with the Name: testing for loginName: AvinashM already exists.');
});


//Create new Ticket
test('open create ticket window with shortcut', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('ControlOrMeta+q');
  await expect(page.getByRole('heading', { name: 'Ticket Resolution Window' })).toBeVisible();
});


//View ticket conversation
test('view ticket conversation from eye icon', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('button').nth(3).click();

  // Wait for first ticket to appear
  const firstTicketCell = page.locator('text=/FA-\\d+/').first();
  await expect(firstTicketCell).toBeVisible();

  // Get ticket text (e.g. FA-81875)
  const ticketText = (await firstTicketCell.textContent())?.trim();

  // Extract only the number (e.g. 81875)
  const ticketNumber = ticketText?.match(/\d+/)?.[0];

  console.log('Dashboard Ticket:', ticketNumber);

  // Open conversation using eye icon
  await page.getByRole('gridcell', { name: 'eye' }).first().click();

  // Validate ticket number is visible in conversation page
  await expect(page.getByText(ticketNumber).first()).toBeVisible();
});


//set default custom view
test('set default custom view persists after re-login', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Blank View$/ }).nth(2).click();
  await page.locator('#ddlCustomView').fill('testing');
  await page.getByTitle('testing', { exact: true }).click();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).fill('TDDefault');
  await page.getByRole('switch', { name: 'Not Default' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await login(page);
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await expect(page.locator('div').filter({ hasText: /^TDDefault$/ }).nth(2)).toBeVisible();
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Custom View deleted successfully');
});


test('refresh ticket row shows no client change', async ({ page }) => {
    await page.getByText('All Tickets').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Refresh Ticket', { exact: true }).click();
    await expect(page.locator('div').filter({ hasText: 'No Change in the Client Name' }).nth(3)).toBeVisible();
  });
  
  
  
  test('redate ticket to future date', async ({ page }) => {
    await page.getByText('All Tickets').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Re-date Ticket').click();
    await page.locator('.ant-picker-input').click();
  await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByText('Ticket has been re-dated successfully.✖')).toBeVisible();
  });
  
  
  
  test('change ticket type between regular and express', async ({ page }) => {
    await page.getByText('All Tickets').click();
  
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Change Ticket Type').click();
  
    const modal = page.locator('.ant-modal-content');
  
    const currentType = await modal
      .locator('.ant-select-selection-item')
      .first()
      .textContent();
  
    console.log('Existing Type:', currentType);
  
  
    const newType =
      currentType?.trim().toLowerCase() === 'regular'
        ? 'Express'
        : 'Regular';
  
    await modal.locator('.ant-select').nth(1).click();
  
  
    const dropdown = page.locator('.ant-select-dropdown').last();
    await dropdown.waitFor({ state: 'visible' });
  
    await dropdown
      .locator('.ant-select-item-option')
      .filter({ hasText: newType })
      .click();
  
    await page.getByRole('button', { name: 'Save' }).click();
  
    await expect(
      page.getByText('TicketID: FA-81696 has been modified for Ticket Type✖')
    ).toBeVisible();
  });
  
  
  
  test('assign or change fund on ticket', async ({ page }) => {
    await page.getByText('All Tickets').click();
  
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Assign/Change Fund').click();
  
    const modal = page.locator('.ant-modal-content');
  
    const currentClient = await modal
      .locator('input[disabled]')
      .inputValue();
  
    console.log('Current Client:', currentClient);
  
    const fundToSelect =
      currentClient.toLowerCase().includes('alphatrade')
        ? 'Alphatrade Fund Ltd.'
        : 'Ausbiz Capital Growise';
  
    console.log('Fund to Select:', fundToSelect);
  
    await modal.locator('.ant-select').click();
  
    const dropdown = page.locator('.ant-select-dropdown').last();
    await dropdown.waitFor({ state: 'visible' });
  
    await dropdown
      .getByTitle(fundToSelect, { exact: true })
      .click();
  
    await page.getByRole('button', { name: 'Save' }).click();
  
    await expect(
      page.getByText('TicketID: FA-81696 has been modified')
    ).toBeVisible();
  });
  
  
  test('change client on ticket', async ({ page }) => {
    await page.getByText('My Tickets').click();
  
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Change Client').click();
  
    const modal = page.locator('.ant-modal-content');
  
  
    const currentClient = await modal
      .locator('input[disabled]')
      .inputValue();
  
    console.log('Existing Client:', currentClient);
  
    const newClient = currentClient.toLowerCase().includes('alphatrade')
      ? 'Ausbiz'
      : 'Alphatrade Capital';
  
    await modal.locator('.ant-select').click();
  
    const dropdown = page.locator('.ant-select-dropdown').last();
    await dropdown.waitFor({ state: 'visible' });
  
    await dropdown
      .locator('.ant-select-item-option')
      .filter({ hasText: newClient })
      .click();
  
    await page.getByRole('button', { name: 'Change Client' }).click();
  
    await expect(
      page.getByText('TicketID: FA-81696 has been modified for Client.✖')
    ).toBeVisible();
  });
  
  
  
  test('add comment to ticket', async ({ page }) => {
    await page.getByText('All Tickets').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('View and Modify Comments').click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('Harsh');
    await page.getByRole('button', { name: 'Add Comment' }).click();
    await expect(page.getByText('Harsh').nth(1)).toBeVisible();
  });
  
  
  
  
  
  
  test('open customer feedback shows none available', async ({ page }) => {
  
    await page.getByText('All Tickets').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81696');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await expect(page.getByText('UniqueTestHarshit007')).toBeVisible();
  await page.keyboard.press('Control+Shift+F');
  
    await expect(page.getByText('No Feedback Available. ✖')).toBeVisible();
  });
  
  
  test('resolve already resolved ticket shows error', async ({ page }) => {
  
    await page.getByText('All Tickets').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81683');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-more > svg').click();
    await page.getByText('Resolve Ticket').click();
    await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').click();
    await page.locator('#ddlGeneralTags').fill('2025');
    await page.locator('#ddlGeneralTags').press('Enter');
    await page.getByText('2025+ 0').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByText('TicketID: FA-81683 has already been resolved. ✖')).toBeVisible();
  });
  
  
  test('export tickets from dashboard', async ({ page }) => {
    await page.getByText('All Tickets').click();
    await page.getByRole('img', { name: '/static/media/Export-tickets.' }).click();
    await expect(page.locator('div').filter({ hasText: 'Tickets exported' }).nth(3)).toBeVisible();
  });
  
  
  
  test('export tickets with invalid date range', async ({ page }) => {
    await page.getByText('All Tickets').click();
    await page.getByText('Custom').click();
    await page.getByRole('textbox', { name: 'Start date' }).click();
    await page.locator('div:nth-child(2) > .ant-picker-date-panel > .ant-picker-header > .ant-picker-header-super-next-btn').click();
    await page.getByText('1', { exact: true }).nth(3).click();
    await page.locator('div:nth-child(2) > .ant-picker-date-panel > .ant-picker-header > .ant-picker-header-super-next-btn').dblclick();
    await page.locator('div:nth-child(2) > .ant-picker-date-panel > .ant-picker-header > .ant-picker-header-super-next-btn').click();
    await page.getByText('1', { exact: true }).nth(3).click();
    await page.getByRole('img', { name: '/static/media/Export-tickets.' }).click();
    await expect(page.locator('div').filter({ hasText: 'Data exports of Tickets for' }).nth(3)).toBeVisible();
  
  });
  
  
  
  test('export tickets with user allocation', async ({ page }) => {
  
    await page.getByText('My Tickets').click();
    await page.getByRole('img', { name: '/static/media/export_tickets_with_user_allocation.2d10e497.svg' }).click();
    await expect(page.getByText('Export Process has started and It will take some time.✖')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Tickets Threads with User Allocation exported successfully' }).nth(3)).toBeVisible();
  });
  
  
  
  
  
  
  
  test('sort due date column descending', async ({ page }) => {
  
    await page.getByText('My Tickets').click();
  
    await page.locator(
      'div:nth-child(7) > .ml-2 > .anticon.anticon-caret-down'
    ).click();
  
    await page.waitForLoadState('networkidle');
  
    const dueDateCells = page.locator('text=/\\d{2}-\\d{2}-\\s*\\d{4}/');
  
    const count = await dueDateCells.count();
  
    const dates = [];
  
    for (let i = 0; i < count; i++) {
      const rawDate = await dueDateCells.nth(i).innerText();
  
      const cleanDate = rawDate
        .replace(/\n/g, '')
        .replace(/\s+/g, '')
        .replace('--', '-');
  
      console.log(`Row ${i + 1}: ${cleanDate}`);
  
      const [month, day, year] = cleanDate.split('-');
  
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
  
      dates.push(date);
    }
  
    // Verify descending order across entire column
    for (let i = 0; i < dates.length - 1; i++) {
      expect(
        dates[i].getTime(),
        `Row ${i + 1} (${dates[i]}) should be >= Row ${i + 2} (${dates[i + 1]})`
      ).toBeGreaterThanOrEqual(
        dates[i + 1].getTime()
      );
    }
  
    console.log('Due Date column is sorted in descending order.');
  });
  
  
  
  
  
  
  
  
  
  test('toggle due date sort ascending and descending', async ({ page }) => {
  
    await page.getByText('My Tickets').click();
  
    // Helper function
    const getAllDueDates = async () => {
      const dueDateCells = page.locator('text=/\\d{2}-\\d{2}-\\s*\\d{4}/');
      const count = await dueDateCells.count();
  
      const dates = [];
  
      for (let i = 0; i < count; i++) {
        const rawDate = await dueDateCells.nth(i).innerText();
  
        const cleanDate = rawDate
          .replace(/\n/g, '')
          .replace(/\s+/g, '')
          .replace('--', '-');
  
        const [month, day, year] = cleanDate.split('-');
  
        dates.push(
          new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          )
        );
      }
  
      return dates;
    };
  
  
    await page
      .locator('div:nth-child(7) > .ml-2 > .anticon.anticon-caret-down')
      .click();
  
    await page.waitForLoadState('networkidle');
  
    const descDates = await getAllDueDates();
  
    for (let i = 0; i < descDates.length - 1; i++) {
      expect(
        descDates[i].getTime(),
        `Row ${i + 1} should be greater than or equal to Row ${i + 2}`
      ).toBeGreaterThanOrEqual(
        descDates[i + 1].getTime()
      );
    }
  
    console.log('Due Date column sorted in Descending order');
  
    
  
    await page
      .locator('div:nth-child(7) > .ml-2 > .anticon.anticon-caret-up')
      .click();
  
    await page.waitForLoadState('networkidle');
  
    const ascDates = await getAllDueDates();
  
    for (let i = 0; i < ascDates.length - 1; i++) {
      expect(
        ascDates[i].getTime(),
        `Row ${i + 1} should be less than or equal to Row ${i + 2}`
      ).toBeLessThanOrEqual(
        ascDates[i + 1].getTime()
      );
    }
  
    console.log('Due Date column sorted in Ascending order');
  });
  
  
  
  
  test('alt i shortcut moves focus from status filter', async ({ page }) => {
  
  
    await page.getByText('My Tickets').click();
  
    await page.locator('.ant-select-selection-overflow').first().click();
  
    const statusDropdown = page.locator('#ddlStatus');
  
    await expect(statusDropdown).toBeFocused();
  
    await page.keyboard.press('Alt+I');
  
    await page.waitForTimeout(1000);
  
    await expect(statusDropdown).not.toBeFocused();
  
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        id: el?.id,
        className: el?.className,
        text: el?.textContent?.substring(0, 100)
      };
    });
  
    console.log('Focused element after Alt+I:', focusedElement);
  
    expect(focusedElement.tagName).not.toBe('INPUT');
  });


  
  




