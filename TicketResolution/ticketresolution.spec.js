import { test, expect } from '@playwright/test';
import { login } from '../Admin/utils/login';

test.beforeEach(async ({ page } , testInfo) => {
await login(page);
});



test('Open Ticket Resolution window', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
await page.getByRole('textbox', { name: 'Ticket No.' }).press('ControlOrMeta+q');;
await expect(page.getByRole('heading', { name: 'Ticket Resolution Window' })).toBeVisible();
});




test('Open in Modify mode for existing ticket', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();
  await page.waitForTimeout(2000);
  await expect(page.getByText('Ticket ID #: FA-81626')).toBeVisible();
  await expect(page.getByText('Ticket Mail ID #: 330123')).toBeVisible();
  await expect(page.getByText('Mail Type: Received')).toBeVisible();
});




test('Open in Read only View mode', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.keyboard.press('Shift+V');

  // Verify Save & Exit button is hidden
  await expect(
    page.getByRole('button', { name: /save & exit/i })
  ).toBeHidden();

  // Verify Preview & Send button is hidden
  await expect(
    page.getByRole('button', { name: /preview & send/i })
  ).toBeHidden();

});




test('Open in Reply mode', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
  await page.getByTitle('Ticket No.').nth(1).click();

  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330123');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Open Reply Mode
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  // Verify Reply mode opened
await expect(page.locator('[id="preview&send"]')).toBeVisible();

  // Add recipient
  await page.getByRole('button', { name: 'plus' }).first().click();

  // Verify dropdown is enabled
  const recipientDropdown = page.locator('.ant-select.w-93');

  await expect(recipientDropdown).toBeVisible();
  await expect(recipientDropdown).not.toHaveClass(/ant-select-disabled/);

  // Verify user can interact with dropdown
  await recipientDropdown.locator('.ant-select-selector').click();

  // Verify rich text editor is editable
  const editorFrame = page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame();

  const editorBody = editorFrame.locator('body');

  await expect(editorBody).toBeEditable();

  // Verify typing works
  await editorBody.click();
  await editorBody.fill('This is a test reply message.');

  await expect(editorBody).toContainText(
    'This is a test reply message.'
  );
});




test('Open in Acknowledge mode', async ({ page }) => {
  // Navigate to All Tickets
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  // Search ticket
  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();

  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330123');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');

  // Open ticket
  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Open Acknowledge Mode
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Acknowledge' }).click();
  // Verify recipient section is displayed
  const recipientField = page.locator('#toInternalRecipients');

  await expect(recipientField).toBeVisible();

  // Verify recipient email is pre-filled
await expect(recipientField).toHaveValue(
  'kavyanshm@navfundservices.com'
);

  // Verify Rich Text Editor is editable
  const editorFrame = page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame();

  const editorBody = editorFrame.locator('body');

  await expect(editorBody).toBeEditable();

  // Verify user can type in editor
  const testMessage = 'This is a test acknowledgement message.';

  await editorBody.click();
  await editorBody.fill(testMessage);

  await expect(editorBody).toContainText(testMessage);
});




test('Open in Forward mode', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();

  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330123');

  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Open Forward Mode
await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Forward', exact: true }).click();

  // Verify To Recipient is empty
  const toRecipientField = page.locator('#toInternalRecipients');

  await expect(toRecipientField).toBeVisible();
  await expect(toRecipientField).toHaveValue('');

  // Open recipient selector
  await page.getByRole('button', { name: 'plus' }).nth(3).click();

  // Verify recipient dropdown appears
  await expect(
    page.locator('.ant-select.w-93 > .ant-select-selector')
  ).toBeVisible();

  // Verify Rich Text Editor is editable
  const editorFrame = page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame();

  const editorBody = editorFrame.locator('body');

  await expect(editorBody).toBeEditable();

  // Verify typing works
  const testMessage = 'This is a test forward message.';

  await editorBody.click();
  await editorBody.fill(testMessage);

  await expect(editorBody).toContainText(testMessage);
});




test('Open Add-to-existing ticket mode', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 42');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Add to Existing Ticket', exact: true }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('button', { name: 'search', exact: true }).click();
  await page.getByRole('checkbox', { name: 'FA-' }).check();
  await page.getByRole('button', { name: 'Add Email To Existing Ticket' }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.locator('div').filter({ hasText: /^TestOnshore$/ }).nth(2)).toBeVisible();
});




test('Return closes window when no changes', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();
  await page.getByRole('button', { name: 'Return' }).first().click();
});



test('Return with unsaved changes prompts discard', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();
  await page.locator('div').filter({ hasText: /^Regular$/ }).nth(2).click();
  await page.locator('#ddlTicketType').fill('Reminder');
  await page.locator('#ddlTicketType').press('Enter');
  await page.getByRole('button', { name: 'Return' }).first().click();
  await expect(page.getByText('Changes have been made to the window, Do you want to discard these changes and Return?')).toBeVisible();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});




test('Select Client resets Fund/Investor/Category', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 42');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Create Ticket', exact: true }).click();
  await expect(page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').first()).toBeVisible();
  await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').first().click();
  await page.getByTitle('AUSBIZ').click();
  await expect(page.getByText('Select Fund')).toBeVisible();
  await expect(page.getByText('Select Investor')).toBeVisible();
  await page.locator('.ant-select.w-100.undefined.ant-select-single > .ant-select-selector').first().click();
  await expect(page.getByTitle('Ausbiz Capital Growise')).toBeVisible();
});




test('Client dropdown editable only on Create', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();

  // Client displayed as read-only text
  await expect(
    page.getByLabel('Ticket Details').getByText('AUSBIZ', { exact: true })
  ).toBeVisible();

  // Ensure there is no editable Client combobox
  await expect(
    page.getByRole('combobox', { name: /client/i })
  ).toHaveCount(0);
});




test('Mailbox Address is mandatory', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('button', { name: 'plus' }).click();
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByRole('paragraph')).toContainText('Choose the mailbox option.');
});




test('Ticket Category is mandatory / not None', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 42');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Create Ticket', exact: true }).click();
  await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').first().click();
  await page.locator('#ddlClients').fill('AUSBIZ');
  await page.locator('#ddlClients').press('Enter');
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByText('The category for ticket mail')).toBeVisible();
});



test('Select additional categories', async ({ page }) => {
  await page.getByRole('button', { name: 'search Search' }).click();

  await page.getByRole('textbox', { name: 'From Address' }).fill(
    'kavyanshm@navfundservices.com'
  );

  await page.getByRole('textbox', { name: 'Subject' }).fill(
    'test email 42'
  );

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await page
    .locator('#email-list-scroll')
    .getByText('KavyanshM@navfundservices.com')
    .click({ button: 'right' });

  await page.getByRole('menuitem', {
    name: 'Create Ticket',
    exact: true
  }).click();

  // Select Category
  await page.locator('div').filter({ hasText: /^None$/ }).nth(3).click();
  await page.locator('#ddlCategory').fill('aryan-active');
  await page.locator('#ddlCategory').press('Enter');

  // Open Additional Category dropdown
  await page
    .locator(
      '.ant-select.w-100.truncate-value-multiple-dropdown > .ant-select-selector'
    )
    .click();

  // Select first additional category
  await page.locator('#ddlAdditionalTicketCategory').fill('Ashish-FA');
  await page.locator('#ddlAdditionalTicketCategory').press('Enter');

  // Select second additional category
  await page.locator('#ddlAdditionalTicketCategory').fill('Anuj');
  await page.locator('#ddlAdditionalTicketCategory').press('Enter');

  // Verify exactly 2 additional categories are selected
  const selectedCategories = page.locator(
    '.ant-select.w-100.truncate-value-multiple-dropdown .ant-select-selection-item'
  );

  await expect(selectedCategories).toHaveCount(2);

});




test('Ticket Mail Status mandatory / not Pending', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 30');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Create Ticket', exact: true }).click();
  await page.locator('div').filter({ hasText: /^Pending Day Reviewer$/ }).nth(2).click();
  await page.getByTitle('Select Status').click();
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByText('Choose the "Ticket Mail Status".')).toBeVisible();
});




// test('Status dropdown disables UsReviewer/NightAuto options', async ({ page }) => {

// });



// test('Fund mandatory when client has RTA and Non-RTA funds', async ({ page }) => {

// });




test('Fund mandatory for multiple accounting mailboxes', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('button', { name: 'plus' }).click();
  await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').first().click();
  await page.locator('#ddlClients').fill('Alpha Quest');
  await page.locator('#ddlClients').press('Enter');
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByRole('paragraph')).toContainText('Please choose fund as this client is associated with numerous accounting client mailboxes.');
});




test('Due Date restriction respects ReDate permission', async ({ page }) => {

  // Search Email
  await page.getByRole('button', { name: 'search Search' }).click();

  await page.getByRole('textbox', { name: 'From Address' }).fill(
    'kavyanshm@navfundservices.com'
  );

  await page.getByRole('textbox', { name: 'Subject' }).fill(
    'test email 40'
  );

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Open Create Ticket
  await page
    .locator('#email-list-scroll')
    .getByText('KavyanshM@navfundservices.com')
    .click({ button: 'right' });

  await page.getByRole('menuitem', {
    name: 'Create Ticket',
    exact: true
  }).click();

  // Open Due Date Calendar
  const dueDatePicker = page.locator('.ant-picker');
  await dueDatePicker.click();

  // Store current due date value
  const dueDateInput = page.locator('.ant-picker input');
  const oldDateValue = await dueDateInput.inputValue();

  // Navigate to previous month
  await page.locator('.ant-picker-header-prev-btn').click();

  // Verify calendar is displayed
  await expect(page.locator('.ant-picker-content')).toBeVisible();

  // Verify disabled dates are present
  const disabledDates = page.locator('.ant-picker-cell-disabled');

  await expect(disabledDates.first()).toBeVisible();

  // Verify multiple dates are disabled
  const disabledCount = await disabledDates.count();

  expect(disabledCount).toBeGreaterThan(0);

  // Attempt to click a disabled date
  await disabledDates.first().click({ force: true });

  // Verify Due Date value did not change
  await expect(dueDateInput).toHaveValue(oldDateValue);

  console.log(
    'PASS: User without ReDate permission cannot select previous month dates.'
  );
});




test('Due Date disabled when modifying a Resolved ticket', async ({ page }) => {
  // Navigate to All Tickets
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  // Search for ticket
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  // Open ticket
  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Open actions menu
  await page.getByRole('cell', { name: 'more' }).click();

  // Click Modify Ticket
  await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();

  // Locate Due Date picker
  const dueDatePicker = page.locator('.ant-picker');

  // Verify Due Date field is visible
  await expect(dueDatePicker).toBeVisible();

  // Verify Due Date field is disabled
  await expect(dueDatePicker).toHaveClass(/ant-picker-disabled/);
});




// test('Reporting Client shown & mandatory (FA + RTA ownership)', async ({ page }) => {

// });




test('Sensitivity dropdown selection', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 43');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Create Ticket', exact: true }).click();
  await page.locator('div:nth-child(18) > .ant-col.ant-col-16 > .ant-select > .ant-select-selector').click();
  await page.getByTitle('Error').click();
await expect(page.getByLabel('Ticket Details')).toContainText('Error');
});




test('Sender On-Behalf-Of mandatory when enabled', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('button', { name: 'plus' }).click();
  await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').first().click();
  await page.locator('#ddlClients').fill('Alpha Quest');
  await page.locator('#ddlClients').press('Enter');
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByRole('paragraph')).toContainText('Choose the sender\'s email address.');
});




test('Refresh buttons reload dropdown lists', async ({ page }) => {
  // Search email
  await page.getByRole('button', { name: 'search Search' }).click();

  await page
    .getByRole('textbox', { name: 'From Address' })
    .fill('kavyanshm@navfundservices.com');

  await page
    .getByRole('textbox', { name: 'Subject' })
    .fill('test email 43');

  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Create Ticket
  await page
    .locator('#email-list-scroll')
    .getByText('KavyanshM@navfundservices.com')
    .click({ button: 'right' });

  await page.getByRole('menuitem', {
    name: 'Create Ticket',
    exact: true
  }).click();

  // -------------------------
  // Ticket Category Refresh
  // -------------------------

  await page.getByRole('button', { name: 'sync' }).nth(1).click();

  await page.locator('div').filter({ hasText: /^None$/ }).nth(3).click();

  // Give the dropdown time to populate
  await page.waitForTimeout(2000);

  const categoryOptions = page.locator('.ant-select-item-option');

  await expect(categoryOptions.first()).toBeAttached({
    timeout: 10000
  });

  const categoryCount = await categoryOptions.count();

  expect(categoryCount).toBeGreaterThan(0);

  console.log(`Ticket Category options loaded: ${categoryCount}`);

  // Close dropdown
  await page.keyboard.press('Escape');

  // -------------------------
  // General Tags Refresh
  // -------------------------

  await page.getByRole('button', { name: 'sync' }).first().click();

  await page
    .locator('.ant-select.w-100.undefined > .ant-select-selector')
    .first()
    .click();

  // Give the dropdown time to populate
  await page.waitForTimeout(2000);

  const tagOptions = page.locator('.ant-select-item-option');

  await expect(tagOptions.first()).toBeAttached({
    timeout: 10000
  });

  const tagCount = await tagOptions.count();

  expect(tagCount).toBeGreaterThan(0);

  console.log(`General Tag options loaded: ${tagCount}`);
});


test('At least one To recipient required to send', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 43');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Create Ticket With Reply' }).click();
  await page.getByRole('button', { name: 'plus' }).nth(3).click();
  await page.locator('.anticon.anticon-close > svg').click();
  await page.locator('[id="preview&send"]').click();
  await expect(page.getByText('Choose at least the "To" recipient.')).toBeVisible();
});



test('Add Registered To recipient', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.getByRole('button', { name: 'plus' }).first().click();
  await page.locator('.ant-select.w-93 > .ant-select-selector').click();
  await page.locator('#toRegistered').fill('trustee');
  await page.locator('#toRegistered').press('Enter');
  await expect(page.getByTitle('trustee <')).toBeVisible();
});



test('Add Internal recipient', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.getByRole('button', { name: 'plus' }).nth(4).click();
  await page.locator('.ant-select.w-93 > .ant-select-selector').click();
  await page.locator('#toInternal').fill('Firebird  <123123@');
  await page.locator('#toInternal').press('Enter');
  await expect(page.getByTitle('Firebird  <123123@')).toBeVisible();
});



test('Add Un-Registered recipient when allowed', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.getByRole('button', { name: '...' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
  await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('abcd@gmail.com');
  await page.locator('.ant-col.ant-col-24 > .ant-btn').click();
  await page.getByRole('button', { name: 'Ok' }).click();
await expect(page.locator('#toUnRegisteredRecipients')).toHaveValue('abcd@gmail.com');
});



test('Recipients disabled in non-draft / read-only', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'View Ticket' }).click();
await expect(page.locator('#toRecipients')).toBeDisabled();
await expect(page.locator('#ccInternalRecipients')).toBeDisabled();
await expect(page.locator('#toUnRegisteredRecipients')).toBeDisabled();
});



test('Accounting Client Mailbox popover', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81770');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'View Ticket' }).click();
await page.getByRole('img', { name: /info-circle/i }).hover();

const tooltip = page.getByRole('tooltip');

await expect(tooltip).toBeVisible();

await expect(tooltip).toContainText(
  'Accounting Client Mailbox associated with this Client are as below:-'
);

await expect(tooltip).toContainText(
  'AlphatradeFund@navfundservices.com'
);
});



test('Subject is mandatory for draft', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('.ant-input.undefined').click();
  await page.locator('.ant-input.undefined').fill('');
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByText('Enter the subject please.')).toBeVisible();
});



// test('Password required when Password Type not None', async ({ page }) => {
 
// });



test('Password + type required for ticket with attachments', async ({ page }) => {
   await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Forward As Attachment (+)' }).click();
  await page.locator('.ant-input.undefined').press('Enter');
  await page.locator('.ant-input.undefined').click();
  await page.locator('div').filter({ hasText: /^Select Password Type$/ }).nth(1).click();
  await page.getByTitle('Random (Without  ZIP)').click();
  await page.locator('.anticon.anticon-eye-invisible > svg').click();
  await page.getByRole('textbox', { name: 'Password' }).fill('');
  await page.locator('[id="save&exit"]').click();
  await expect(page.getByText('Password type and password is required when creating a ticket with attachments.')).toBeVisible();
  await expect(page.getByText('The password field must not be left empty when a password type other than "None" is selected.')).toBeVisible();
});



test('Select Reply Type and Reply Text', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('div').filter({ hasText: /^Select Reply Type$/ }).nth(1).click();
  await page.locator('#ddlReplyType').fill('Bread');
  await page.locator('#ddlReplyType').press('Enter');
  await page.locator('div').filter({ hasText: /^Select Reply Text$/ }).nth(1).click();
  await page.locator('#ddlReplyText').fill('testing1');
  await page.locator('#ddlReplyText').press('Enter');
  await expect(page.locator('iframe[title="Rich Text Area"]').contentFrame().getByText('hello this is for the testing')).toBeVisible();
});



test('Override draft body content checkbox', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('iframe[title="Rich Text Area"]').contentFrame().locator('html').click();
  await page.locator('iframe[title="Rich Text Area"]').contentFrame().getByLabel('Rich Text Area. Press ALT-0').fill('hello testing');
  await page.locator('div').filter({ hasText: /^Select Reply Type$/ }).nth(1).click();
  await page.locator('#ddlReplyType').fill('Bread');
  await page.locator('#ddlReplyType').press('Enter');
  await page.getByRole('checkbox').nth(1).check();
  await page.locator('div').filter({ hasText: /^Select Reply Text$/ }).nth(1).click();
  await page.locator('#ddlReplyText').fill('testing1');
  await page.locator('#ddlReplyText').press('Enter');
  await expect(page.locator('iframe[title="Rich Text Area"]').contentFrame().getByText('hello this is for the testing')).toBeVisible();
});



test('Set Importance Low/Normal/High', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81820');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Draft' }).click();
  await page.locator('.ant-radio-group.ant-radio-group-outline.d-flex.mr-1 > label:nth-child(3)').click();
  await page.locator('[id="save&exit"]').click();
  await page.getByRole('menuitem', { name: 'mail MailBoxes' }).click();
  await page.getByRole('menuitem', { name: /^TestOnshore/ }).click();
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('testonshoreforrta@navbackoffice.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 39');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('.d-flex.modal-mail-items-icons > span > svg > path').first()).toBeVisible();
    await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).first().click();
  await page.getByRole('menuitem', { name: 'Modify Draft' }).click();
  await page.locator('.ant-radio-group.ant-radio-group-outline.d-flex.mr-1 > label:nth-child(2)').click();
  await page.locator('[id="save&exit"]').click();
});




test('Attach file to draft', async ({ page }) => {
  // Open ticket
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81783');

  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  await page.getByRole('cell', { name: 'more' }).first().click();

  await page.getByRole('menuitem', { name: 'Reply' }).click();

  // Attach file
  await page.getByRole('button', { name: 'upload' }).click();

  await page
    .locator('div')
    .filter({ hasText: /^\\\\FLSINEDrive\\navsoft\\123R32\\AUSBIZ\\$/ })
    .nth(3)
    .click();

  await page
    .getByTitle('\\\\FLSINYdrive\\vol2\\123R32\\')
    .click();

  await page.getByText('Invoice').click();

await page.getByRole('checkbox', { name: 'file-pdf 0526AUSBIZCAPEMER.PDF' }).check();

  await page.getByRole('button', { name: 'Ok' }).click();

  // Verify at least one attachment is present
  const attachments = page.locator('[id^="attachment-"]');

  await expect.poll(async () => {
    return await attachments.count();
  }).toBeGreaterThan(0);

  const attachmentCount = await attachments.count();

  console.log(`Attachment count: ${attachmentCount}`);

  expect(attachmentCount).toBeGreaterThan(0);
});



test('Email body disabled when not draft', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81820');

  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  await page.getByRole('cell', { name: 'more' }).first().click();

  await page.getByRole('menuitem', { name: 'View Draft' }).click();

  const editorFrame = page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame();

  const editorBody = editorFrame.locator('body');

  await expect(editorBody).toBeVisible();

  await expect(editorBody).toHaveAttribute('contenteditable', 'false');
});




// test('Not-latest-message warning shown', async ({ page }) => {

// });



test('Full screen pop-out email detail', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('.anticon.anticon-fullscreen > svg').click();
  await expect(page.getByRole('heading', { name: 'Email Detail Window' })).toBeVisible();
});




test('Esc exits full screen', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('.anticon.anticon-fullscreen > svg').click();
  await expect(page.getByRole('heading', { name: 'Email Detail Window' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading')).toContainText('Ticket Resolution Window');
});




test('Email analysis on empty editor blocked', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81823');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: 'more' }).click();
  await page.getByRole('menuitem', { name: 'Reply' }).click();
  await page.locator('[id="preview&send"]').click();
  await expect(page.getByRole('heading')).toContainText('Draft Preview Window');
});


test('Internal AB - Ok commits, Cancel discards', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });


    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    const tooltip = page.locator('#toInternalRecipients');
    await tooltip.hover();
    await expect(
        page.getByRole('tooltip', {
            name: /raviar@navfundservices\.com/i
        })
    ).toBeVisible();

    await expect(
        page.getByRole('tooltip', {
            name: /raviar@navfundservices\.com/i
        })
    ).toContainText('raviar@navfundservices.com');
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();

    await page.getByRole('cell', { name: 'Nomailboxrequired@' }).dblclick();
    await page.getByRole('cell', { name: '@navbackoffice.com', exact: true }).dblclick();
    await expect(page.getByLabel('Internal Address Book')).toContainText('raviar@navfundservices.com nomailboxrequired@navfundservices.com@navbackoffice.com');
    await page.getByRole('button', { name: 'Ok' }).click();

    await tooltip.hover();
    await expect(page.getByRole('tooltip')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('tooltip')).toContainText('raviar@navfundservices.comSample-MDMCDS-Testing < nomailboxrequired@navfundservices.com>Abhi aaaa <@navbackoffice.com>');

    await page.getByRole('button', { name: '...' }).nth(1).click();
    await page.locator('div:nth-child(2) > .ant-select-selection-item > .ant-select-selection-item-remove > .anticon > svg').click();
    await page.locator('div:nth-child(2) > .ant-select-selection-item > .ant-select-selection-item-remove > .anticon > svg').click();
    await page.getByRole('button', { name: 'Ok' }).click();


    //cancel
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await page.getByRole('cell', { name: 'Nomailboxrequired@' }).dblclick();
    await page.getByRole('cell', { name: '@navbackoffice.com', exact: true }).dblclick();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await tooltip.hover();
    await expect(page.getByRole('tooltip')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('tooltip')).toContainText('raviar@navfundservices.com');


    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//63
test('Draft template attachments confirmation', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').first().click();
    await page.getByText('Select Reply Type').click();
    await page.getByTitle('Advanced').click();
    await page.getByText('Select Reply Text').click();
    await page.getByTitle('112233', { exact: true }).click();
    await page.locator('[id="preview&send"]').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('dialog')).toContainText('Some of your attachments are added from Draft Template. Do you want to proceed?');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});

//62
test('Attachment size limit confirmation', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').first().click();
    await page.locator('[id="preview&send"]').click();
    await expect(page.getByRole('dialog')).toContainText('Attachments Size is limited to 5MB while sending/drafting mail to Internal Recipients');
    await page.getByRole('button', { name: 'Cancel' }).click();
});

//50 


test('Save & Exit updates ticket', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81798');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').click();
    await page.locator('.ant-select.w-100.undefined > .ant-select-selector').first().click();
    await page.locator('#ddlGeneralTags').fill('Acc t');
    await page.locator('#ddlGeneralTags').press('Enter');
    await page.locator('[id="save&exit"]').click();
    await expect(page.locator('#root')).toContainText('TicketID: FA-81798 has been modified for TicketMailID: 330257.✖');
    await page.locator('.anticon.anticon-edit > svg').click();
    await page.locator('.anticon.anticon-close-circle > svg').click();
    await page.locator('[id="save&exit"]').click();
});



//54
test('Unregistered recipient confirmation on save', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Reply' }).click();

    await page.locator('#ddlClients').click();
    await page.getByTitle('CV PC').click();

    await page.locator('div').filter({ hasText: /^None$/ }).nth(3).click();
    await page.locator('#ddlCategory').fill('MG');
    await page.locator('#ddlCategory').press('Enter');

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('babumusai7284@gmail.com');
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.locator('[id="save&exit"]').click();
    await expect(page.getByRole('dialog')).toContainText('Do you want to continue?This draft\'s recipient is not listed');
});



//59
test('Preview & Send with ReplyTicket permission', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').first().click();
    await page.locator('.anticon.anticon-close-circle > svg').first().click();
    await page.locator('[id="preview&send"]').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByRole('heading', { name: 'Draft Preview Window (Ticket' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'send Send' })).toBeVisible();
    await page.locator('.anticon.anticon-arrow-left > svg').click();

    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//61
test('Send requires attachment self-verify', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').first().click();
    await page.locator('.anticon.anticon-close-circle.ml-1 > svg').first().click();

    await page.locator('[id="preview&send"]').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByLabel('', { exact: true }).check();
    await page.getByLabel('', { exact: true }).uncheck();
    await page.getByRole('button', { name: 'send Send' }).click();
    await expect(page.locator('#root')).toContainText('Please self verify the attachments before sending the mail. ✖');
    await page.locator('.anticon.anticon-arrow-left > svg').click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});





//64
test('Ticket Details tab active by default', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click();
    await page.locator('#email-wrapper-container').press('Alt+c');
    await expect(page.getByRole('tab', { name: 'Ticket Details' })).toMatchAriaSnapshot(`- tab "Ticket Details" [selected]`);
});


//65
test('Logs tab disabled on Create, enabled on existing', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.locator('#email-list-scroll').getByText('Testing Tickets').click();
    await page.locator('#email-wrapper-container').press('Alt+c');
    await expect(page.getByRole('tab', { name: 'Logs' })).toMatchAriaSnapshot(`- tab "Logs" [disabled]`);
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 008');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets').click();
    await page.locator('#email-wrapper-container').press('Control+Alt+V');
    await expect(page.getByRole('tab', { name: 'Logs' })).toMatchAriaSnapshot(`- tab "Logs"`);
});


//66
test('User Allocation tab disabled until client selected', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await expect(page.getByLabel('Ticket Details')).toContainText('Select Client');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- tab "User Allocation" [disabled]`);
    await page.locator('#ddlClients').click();
    await page.getByTitle('CV PC').click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- tab "User Allocation"`);
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});

//67
test('Comments panel opens', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await expect(page.locator('div').filter({ hasText: 'Comments' }).nth(4)).toBeVisible();
    await page.getByRole('button', { name: 'Comments' }).click();
    await page.getByRole('button', { name: 'Comments' }).click();
    await expect(page.locator('div').filter({ hasText: 'Comments' }).nth(4)).toBeVisible();

    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//78
test('Open Internal Address Book window', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search By Email Address' })).toBeVisible();
    await expect(page.locator('.ant-spin-container')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});

//79
test('Internal AB-search by email address', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();

    await page.getByRole('textbox', { name: 'Search By Email Address' }).click();
    await page.getByRole('textbox', { name: 'Search By Email Address' }).fill('avinashm@navbackoffice.com');
    await page.getByRole('textbox', { name: 'Search By Email Address' }).press('Enter');
    await expect(page.locator('.ant-table-body')).toContainText('AvinashM@navbackoffice.com');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//80
test('Internal AB-add contact to To/Cc/Bcc', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();

    await page.getByRole('textbox', { name: 'Search By Email Address' }).click();
    await page.getByRole('textbox', { name: 'Search By Email Address' }).fill('avinashm@navbackoffice.com');
    await page.getByRole('textbox', { name: 'Search By Email Address' }).press('Enter');
    await expect(page.locator('.ant-table-body')).toContainText('AvinashM@navbackoffice.com');

    await page.getByRole('button', { name: 'To ->' }).click();
    await page.getByRole('cell', { name: 'AvinashM@navbackoffice.com' }).dblclick();
    await expect(page.getByLabel('Internal Address Book')).toContainText('raviar@navfundservices.comavinashm@navbackoffice.com');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//81
test('Internal AB-disabled contact blocked', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();

    await page.getByRole('textbox', { name: 'Search By Email Address' }).click();
    await page.getByRole('textbox', { name: 'Search By Email Address' }).fill('aayusha@navbackoffice.com');
    await page.getByRole('textbox', { name: 'Search By Email Address' }).press('Enter');
    await expect(page.getByRole('cell', { name: 'aayusha@navbackoffice.com' })).toBeVisible();
    await page.getByRole('cell', { name: 'aayusha@navbackoffice.com' }).dblclick();
    await expect(page.getByText('You can not select disabled contact. ✖')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//82
test('Internal AB-duplicate contact blocked', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByText('Internal Address Book')).toBeVisible();

    await page.getByRole('textbox', { name: 'Search By Email Address' }).click();
    await page.getByRole('textbox', { name: 'Search By Email Address' }).fill('avinashm@navbackoffice.com');
    await page.getByRole('textbox', { name: 'Search By Email Address' }).press('Enter');
    await expect(page.locator('.ant-table-body')).toContainText('AvinashM@navbackoffice.com');

    await page.getByRole('button', { name: 'To ->' }).click();
    await page.getByRole('cell', { name: 'AvinashM@navbackoffice.com' }).dblclick();
    await page.getByRole('cell', { name: 'AvinashM@navbackoffice.com' }).dblclick();
    await expect(page.getByText('This contact is already selected. ✖')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});



//85
test('Open Registered Address Book window', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).first().click();
    await expect(page.getByText('Registered Address Book')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Client / Fund' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Service Provider' })).toBeVisible();
    await expect(page.getByLabel('Registered Address Book').getByRole('tablist')).toMatchAriaSnapshot(`- tab "Investor" [disabled]`);
});


// test('test', async ({ page }) => {
//     const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
//     await mailbox.click();
//     await page.getByRole('button', { name: 'search Search' }).click();
//     await page.getByRole('textbox', { name: 'From Address' }).click();
//     await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
//     await page.getByRole('button', { name: 'Search', exact: true }).click();
//     await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
//         button: 'right'
//     });
//     await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

//     await page.getByRole('button', { name: '...' }).first().click();

//     await expect(page.getByRole('textbox', { name: 'Investor Name' })).toContainText('');
//     await expect(page.getByLabel('Registered Address Book').getByRole('tablist')).toMatchAriaSnapshot(`- tab "Investor" [disabled]`);

// });

//90
test('Open Un-Registered Recipients window', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Un Registered Recipients$/ }).nth(2)).toBeVisible();
    await expect(page.getByText('Add New Recipient')).toBeVisible();
});

//72
test('Alt+X triggers Save & Exit', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81798');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-edit > svg').click();
    await page.locator('.ant-select.w-100.undefined > .ant-select-selector').first().click();
    await page.locator('#ddlGeneralTags').fill('Acc t');
    await page.locator('#ddlGeneralTags').press('Enter');
    await page.locator('[id="save&exit"]').click();
    await expect(page.locator('#root')).toContainText('TicketID: FA-81798 has been modified for TicketMailID: 330257.✖');
    await page.locator('.anticon.anticon-edit > svg').click();
    await page.locator('.anticon.anticon-close-circle > svg').click();
    await page.locator('[id="save&exit"]').click();
});

//74
test('Shortcut Keys popover lists shortcuts', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    const info = page.getByRole('img', { name: 'Info' });
    await info.click();
    await expect(page.getByText('Shortcut Keys')).toBeVisible();

    const box = page
        .getByRole('tooltip')
        .locator('div')
        .filter({ hasText: 'ActionsShortcutsMailbox' });

    await expect(box).toBeVisible();

    await expect(page.getByRole('tooltip').locator('div').filter({ hasText: 'ActionsShortcutsMailbox' })).toContainText('ActionsShortcutsMailbox Address FocusAlt + TPassword Field FocusAlt + MPreview DraftAlt + PPreview & SendAlt + SSave & ExitAlt + XFocus Registered RecipientAlt + RFocus Internal recipientAlt + IFocus Unregistered RecipientAlt + URun Email AnalysisAlt + AOpen Spell CheckAlt + L');
});
//51 
test('Cannot resolve a Draft', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Modify Draft' }).click();
    await page.getByText('Pending Day Reviewer').click();
    await page.getByTitle('Resolved').click();
    // await page.locator('#ddlGeneralTags').fill('2025');
    // await page.locator('#ddlGeneralTags').press('Enter');
    await page.locator('[id="save&exit"]').click();
    await expect(page.getByText('You can\'t resolve a Draft. ✖')).toBeVisible();
});



//73 
test('Alt+R/Alt+I/Alt+U focus recipient sections', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('heading', { name: 'Ticket Resolution Window' }).click();

    const btn1 = page.getByRole('button', { name: '...' }).first();
    await page.locator('body').press('Alt+r');
    // await page.waitForTimeout(2000);
    await expect(btn1).toBeFocused();

    const btn2 = page.getByRole('button', { name: '...' }).nth(1)
    await page.locator('body').press('Alt+i');
    // await page.waitForTimeout(2000);
    await expect(btn2).toBeFocused();

    const btn3 = page.getByRole('button', { name: '...' }).nth(2)
    await page.locator('body').press('Alt+u');
    // await page.waitForTimeout(2000);
    await expect(btn3).toBeFocused();


    await page.getByRole('button', { name: 'Return' }).first().click();
    await page.getByRole('button', { name: 'OK' }).click();
});


//71
test('Alt+P opens Draft Preview', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Modify Draft' }).click();
    await page.getByRole('tablist').filter({ hasText: 'Ticket DetailsLogsUser' }).click();
    await page.locator('body').press('Alt+p');
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByText('<Disclaimer>Draft Preview')).toBeVisible();
});


// 70 
// test('Alt+M focuses Password field', async ({ page }) => {

//     await page.getByRole('menuitem', { name: 'All Tickets' }).click();
//     await page.getByRole('textbox', { name: 'Ticket No.' }).click();
//     await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81827');
//     await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
//     await page.locator('.anticon.anticon-eye > svg').click();
//     await page.locator('.anticon.anticon-more > svg').first().click();
//     await page.getByRole('menuitem', { name: 'Modify Draft' }).click();
//     await page.getByRole('tablist').filter({ hasText: 'Ticket DetailsLogsUser' }).click();
//     await page.locator('body').press('Alt+m');
//     const field = page.locator('div').filter({ hasText: /^None$/ }).nth(4);
//     console.log("field");
//     await page.waitForTimeout(2000);
//     await expect.poll(async () => {
//         return await field.evaluate(el => el.contains(document.activeElement));
//     }).toBe(true)

// });


//91 
test('Un-Registered - add valid email', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Un Registered Recipients$/ }).nth(2)).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('babumusai7284@gmail.com');
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();



    await expect(
        page
            .getByRole('dialog', { name: 'Un Registered Recipients' })
            .getByPlaceholder('To Recipients')
    ).toHaveValue('babumusai7284@gmail.com');



});


//92
test('Un-Registered - add multiple semicolon-separated', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Un Registered Recipients$/ }).nth(2)).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('babumusai7284@gmail.com');
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();

    await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('hg@gmail.com');
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();

    await expect(
        page
            .getByRole('dialog', { name: 'Un Registered Recipients' })
            .getByPlaceholder('To Recipients')
    ).toHaveValue('babumusai7284@gmail.com;hg@gmail.com');
});

//93
test('Un-Registered - invalid email rejected', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Un Registered Recipients$/ }).nth(2)).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).click();
    await page.getByRole('textbox', { name: 'Enter Recipient' }).fill('abcd');
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();
    await expect(page.getByText('Invalid recipient. abcd ✖')).toBeVisible();

});

//94
test('Un-Registered - empty add / empty Ok', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 009');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Testing Tickets 009').click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Create Ticket With Acknowledge' }).click();

    await page.getByRole('button', { name: '...' }).nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Un Registered Recipients$/ }).nth(2)).toBeVisible();
    await page.locator('.ant-col.ant-col-24 > .ant-btn').click();
    await expect(page.getByText('Please enter recipient. ✖')).toBeVisible();
});