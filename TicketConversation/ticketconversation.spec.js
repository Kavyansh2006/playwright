import { test, expect } from '@playwright/test';
import { login } from '../Admin/utils/login';

test.beforeEach(async ({ page } , testInfo) => {
await login(page);
});



//test 1
test('Open Ticket Conversation from dashboard', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
   await page.locator('.ant-row.ant-row-middle > div').first().click();

await expect(page.getByRole('heading', { name: 'Ticket Conversation' })).toBeVisible();

  // Conversation grid row
  const rows = page.getByRole('row').filter({
    has: page.getByRole('cell'),
  });

  const rowCount = await rows.count();

  expect(rowCount).toBeGreaterThan(0);

  console.log(`Found ${rowCount} ticket conversation thread(s)`);
});



//test2
test('Conversation displays ticket title and thread list', async ({ page }) => {

  // Open All Tickets
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  // Capture ticket ID from All Tickets page (e.g. FA-81875)
  const ticketText = (
    await page.getByText(/^FA-\d+$/).first().textContent()
  )?.trim();

  expect(ticketText).toBeTruthy();

  // Extract only ticket number (e.g. 81875)
  const dashboardTicketId = ticketText?.match(/\d+/)?.[0];

  console.log('Dashboard Ticket ID:', dashboardTicketId);

  // Open conversation
  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Wait for conversation window
  const heading = page.getByRole('heading', {
    name: /Ticket Conversation/
  });

  await expect(heading).toBeVisible();

  // Get heading text
  const headingText = await heading.textContent();

  console.log('Conversation Heading:', headingText);

  // Extract ticket number from heading
  // Example:
  // Ticket Conversation (81875 => AT-Research Managed Futures Fund LP => ...)
  const conversationTicketId = headingText?.match(/\d+/)?.[0];

  console.log('Conversation Ticket ID:', conversationTicketId);

  // Compare numeric values
  expect(conversationTicketId).toBe(dashboardTicketId);

  // Additional validations
  await expect(
    page.locator('div').filter({ hasText: /^Ticket Mail ID$/ }).first()
  ).toBeVisible();

  await expect(
    page.getByRole('columnheader', { name: 'Category' })
  ).toBeVisible();

  await expect(
    page.getByRole('columnheader', { name: /TMS/ })
  ).toBeVisible();

  await expect(
    page.locator('div').filter({ hasText: /^Due Date$/ })
  ).toBeVisible();

  await expect(
    page.locator('div').filter({ hasText: /^Mail Date$/ })
  ).toBeVisible();

  await expect(
    page.locator('div').filter({ hasText: /^Subject$/ })
  ).toBeVisible();

  await expect(
    page.locator('div').filter({ hasText: /^From$/ })
  ).toBeVisible();
});



//test 3
test('Back to Ticket Dashboard', async ({ page }) => {

 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();
await expect(page.getByRole('heading', { name: 'Ticket Conversation' })).toBeVisible();
   await page.keyboard.press('Alt+B');
await expect(page.getByText('Ticket Dashboard')).toBeVisible();

    await page.locator('.ant-row.ant-row-middle > div').first().click();
  await expect(page.getByRole('heading', { name: 'Ticket Conversation' })).toBeVisible();
  await page.locator('.anticon.anticon-arrow-left > svg').click();
  await expect(page.getByText('Ticket Dashboard')).toBeVisible();
});



//test 5
test('First thread auto-selected on load', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
 await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Wait for conversation page
 await expect(page.getByRole('heading', { name: 'Ticket Conversation' })).toBeVisible();

  // Get the first thread row (currently selected/highlighted)
  const firstRow = page.getByRole('table').nth(1).getByRole('row').first();

  await expect(firstRow).toBeVisible();

  // Ticket Mail ID from highlighted thread
  const threadMailId = (
    await firstRow.getByRole('cell').nth(4).textContent()
  )?.trim();

  // EMAIL DETAILS heading
  const emailDetailsHeading = page.getByRole('heading', {
    name: /EMAIL DETAILS \(Ticket MailID:/,
  });

  await expect(emailDetailsHeading).toBeVisible();

  const headingText = await emailDetailsHeading.textContent();

  // Extract Mail ID from heading
  const detailsMailId =
    headingText?.match(/Ticket MailID:\s*(\d+)/)?.[1];

  // Compare both IDs
  expect(detailsMailId).toBe(threadMailId);
});



//test 6
test('Refresh reloads conversation data', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
 await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Verify Ticket Conversation opened
await expect(page.getByRole('heading', { name: 'Ticket Conversation' })).toBeVisible();

  // Capture selected thread Mail ID before refresh
  const firstRow = page.getByRole('table').nth(1).getByRole('row').first();

  const mailIdBefore = (
    await firstRow.getByRole('cell').nth(4).textContent()
  )?.trim();

  expect(mailIdBefore).toBeTruthy();

  // Refresh Ticket
  await page.getByRole('img', { name: 'Refresh Ticket' }).click();

  // Verify page is still open
  await expect(page.getByRole('heading', { name: /Ticket Conversation/ })).toBeVisible();

  // Verify thread still exists after refresh
  await expect(page.getByText(mailIdBefore, { exact: true })).toBeVisible();

  // Verify Email Details section is loaded
  await expect(page.getByRole('heading', {name: /EMAIL DETAILS \(Ticket MailID:/})
).toBeVisible();
});



//test 7
test('Select thread loads email details', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('.ant-row.ant-row-middle > div').first().click();

  await expect(
    page.getByRole('heading', { name: /Ticket Conversation/ })
  ).toBeVisible();

  // Get all thread rows
  const rows = page.getByRole('table').nth(1).getByRole('row');

  const rowCount = await rows.count();

  expect(rowCount).toBeGreaterThan(0);

  // Select a row dynamically
  const rowIndex = rowCount > 1
    ? Math.floor(Math.random() * rowCount)
    : 0;

  const selectedRow = rows.nth(rowIndex);

  // Ticket Mail ID column
  const selectedMailId = (
    await selectedRow.getByRole('cell').nth(4).textContent()
  )?.trim();

  expect(selectedMailId).toBeTruthy();

  await selectedRow.click();

  const emailDetailsHeading = page.getByRole('heading', {
    name: /EMAIL DETAILS/
  });

  await expect(emailDetailsHeading).toBeVisible();

  const headingText = await emailDetailsHeading.textContent();

  const detailMailId =
    headingText?.match(/Ticket MailID:\s*(\d+)/)?.[1];

  expect(detailMailId).toBe(selectedMailId);
});



//test 9
test('Attachment icon when mail has attachments', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81528');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();

  const attachmentIcon = page.locator('.ant-table-cell svg').first();
  const dash = page.getByRole('cell', { name: '-' }).first();

  const hasAttachmentIcon = await attachmentIcon.isVisible().catch(() => false);
  const hasDash = await dash.isVisible().catch(() => false);

  expect(hasAttachmentIcon || hasDash).toBeTruthy();
});


//test 12
test('Bad conversation flag icon displayed', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).click();
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330123');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
 await expect(page.getByRole('cell', { name: 'flag' })).toBeVisible();
});




//test 13
test('Password field for encrypted emails', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81619');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
    await page.waitForTimeout(2000);

  await expect(page.locator('.ant-input-affix-wrapper')).toBeVisible();
  await expect(page.locator('.anticon.anticon-eye-invisible > svg')).toBeVisible();
});




//test 16
test('Filter by Ticket Mail ID', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).click();
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330243');
 await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');
 await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByLabel('Ticket Mail ID').getByRole('button', { name: 'search' }).click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('330243');
  await page.getByRole('menuitem', { name: '330243' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('cell', { name: '330243' }).locator('b')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'EMAIL DETAILS (Ticket MailID: 330243)' })).toBeVisible();
});



//test 17
test('Filter by Category', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByLabel('Category').getByRole('button', { name: 'search' }).click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('aryan-active');
  await page.getByRole('menuitem', { name: 'aryan-active' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('aryan-acti...')).toBeVisible();
});



//test 18
test('Filter by Ticket Mail Status (TMS)', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('columnheader', { name: 'TMS question-circle caret-up' }).getByRole('button').click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('pending');
  await page.getByRole('menuitem', { name: 'Pending Day Reviewer' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Pending Day Revie...')).toBeVisible();
});

//97
test('Add bad conversation comment', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
      await page.locator('.ant-row.ant-row-middle > div').first().click();

    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Bad Conversation Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('Bad comment test');
    await page.getByRole('button', { name: 'Add Comment' }).click();

    const ticketId = "FA-81759"
    await expect(page.getByRole('alert')).toContainText(`TicketID: ${ticketId}`);


      await page.getByRole('cell', { name: 'flag' }).click();
      await page.locator('.ml-5 > .anticon').click();
     await page.getByRole('textbox', { name: 'Enter Comment' }).click();
  await page.getByRole('textbox', { name: 'Enter Comment' }).fill('');
  await page.getByRole('button', { name: 'Update Comment' }).click();
});

//test 19
test('Clear conversation filters', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Wait for conversation grid to load
  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');
  await expect(rows.first()).toBeVisible();

  // Capture Ticket Mail IDs before filter
  const mailIdsBefore = [];

  const beforeCount = await rows.count();

  for (let i = 0; i < beforeCount; i++) {
    const rowText = await rows.nth(i).innerText();

    const match = rowText.match(/\b\d{6}\b/);

    if (match) {
      mailIdsBefore.push(match[0]);
    }
  }

  expect(mailIdsBefore.length).toBeGreaterThan(0);

  // Apply TMS filter
  await page
    .getByRole('columnheader', { name: /TMS/ })
    .getByRole('button')
    .click();

  await page
    .getByRole('textbox', { name: 'Search in filters' })
    .fill('pending');

  await page
    .getByRole('menuitem', { name: 'Pending Day Reviewer' })
    .getByLabel('', { exact: true })
    .check();

  await page.getByRole('button', { name: 'OK' }).click();

  await expect(page.getByText('Pending Day Revie...')).toBeVisible();

  // Clear filter
  await page.locator('.anticon.anticon-delete > svg').click();

  // Wait for grid refresh
  await page.waitForTimeout(2000);

  // Capture Ticket Mail IDs after clearing filter
  const mailIdsAfter = [];

  const afterCount = await rows.count();

  for (let i = 0; i < afterCount; i++) {
    const rowText = await rows.nth(i).innerText();

    const match = rowText.match(/\b\d{6}\b/);

    if (match) {
      mailIdsAfter.push(match[0]);
    }
  }

  // Verify original data restored
  expect(mailIdsAfter).toEqual(mailIdsBefore);
});



//test 20
test('Combined Category + Status filter', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
     await page.getByLabel('Category').getByRole('button', { name: 'search' }).click();
  await page.getByRole('menuitem', { name: 'aryan-active' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('columnheader', { name: 'TMS question-circle caret-up' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Pending Day Reviewer' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'OK' }).click();

  await expect(page.getByText('aryan-acti...')).toBeVisible();
  await expect(page.getByText('Pending Day Revie...')).toBeVisible();
});



//test 21
test('Filter search in dropdown', async ({ page }) => {
 await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByLabel('Ticket Mail ID').getByRole('button', { name: 'search' }).click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('330124');
  await expect(page.locator('span').filter({ hasText: '330124' }).nth(1)).toBeVisible();
});



//test 22
test('Filter returns empty when no match', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByLabel('Ticket Mail ID').getByRole('button', { name: 'search' }).click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('99999999');
  await expect(page.getByRole('menu').filter({ hasText: /^$/ })).toBeVisible();
});



//test 23
test('Sort by Ticket Mail ID', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

await page.locator('.ant-row.ant-row-middle > div').first().click();
  // Ascending
  await page.locator('div').filter({ hasText: /^Ticket Mail ID$/ }).nth(1).click();

  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  // Descending
  await page.locator('div').filter({ hasText: /^Ticket Mail ID$/ }).nth(1).click();

  // Get all rows
  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');
  const rowCount = await rows.count();

  const mailIds = [];

  for (let i = 0; i < rowCount; i++) {
    const mailId = await rows
      .nth(i)
      .locator('td')
      .nth(4) // Ticket Mail ID column
      .textContent();

    mailIds.push(Number(mailId?.trim()));
  }

  // Create expected descending order
  const expectedDescending = [...mailIds].sort((a, b) => b - a);

  // Verify grid is sorted descending
  expect(mailIds).toEqual(expectedDescending);

  console.log('Mail IDs:', mailIds);
});
``



//test 24
test('Sort by Due Date', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81626');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Sort ascending
  await page.locator('div').filter({ hasText: /^Due Date$/ }).click();

  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');
  const rowCount = await rows.count();

  const dueDates = [];

  for (let i = 0; i < rowCount; i++) {
    const dateText = await rows
      .nth(i)
      .locator('td')
      .nth(7) // Due Date column
      .textContent();

    dueDates.push(new Date(dateText.trim()));
  }

  const expectedAscending = [...dueDates].sort(
    (a, b) => a.getTime() - b.getTime()
  );

  expect(dueDates).toEqual(expectedAscending);
});



//test 25
test('Sort by Mail Date', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Click Mail Date sort
  await page.locator('div').filter({ hasText: /^Mail Date$/ }).click();

  // Verify ascending sort applied
  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  // Wait for table to finish rendering
  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');
  await expect(rows.first()).toBeVisible();

  const mailDates = [];

  const rowCount = await rows.count();

  for (let i = 0; i < rowCount; i++) {
    const rowText = await rows.nth(i).innerText();

    const match = rowText.match(
      /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+(AM|PM)/
    );

    if (match) {
      const date = new Date(match[0]);
      mailDates.push(date.getTime());
    }
  }

  expect(mailDates.length).toBeGreaterThan(0);

  const sortedDates = [...mailDates].sort((a, b) => a - b);

  expect(mailDates).toEqual(sortedDates);

  console.log('Mail Dates:', mailDates);
});



//test 26
test('Sort by Subject', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Sort ascending
  await page.locator('div').filter({ hasText: /^Subject$/ }).click();

  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');

  await expect(rows.first()).toBeVisible();

  const firstSubject = (await rows.nth(0).innerText()).trim();
  const secondSubject = (await rows.nth(1).innerText()).trim();

  expect(
    firstSubject.localeCompare(secondSubject, undefined, {
      sensitivity: 'base',
    })
  ).toBeLessThanOrEqual(0);
});



//test 27
test('Sort by From address', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  // Sort ascending
  await page.locator('div').filter({ hasText: /^From$/ }).click();

  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  const rows = page.locator('tbody tr:not(.ant-table-measure-row)');

  await expect(rows.first()).toBeVisible();

  const firstRowText = await rows.nth(0).innerText();
  const secondRowText = await rows.nth(1).innerText();

  // Extract email addresses
  const firstEmail =
    firstRowText.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] || '';

  const secondEmail =
    secondRowText.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] || '';

  expect(firstEmail.localeCompare(secondEmail)).toBeLessThanOrEqual(0);

  console.log('First Email:', firstEmail);
  console.log('Second Email:', secondEmail);
});



//test 28
test('Toggle sort ascending/descending', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();

  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

  await page.locator('.ant-row.ant-row-middle > div').first().click();

  const mailIdHeader = page
    .locator('div')
    .filter({ hasText: /^Ticket Mail ID$/ })
    .nth(1);

  // ASCENDING SORT
  await mailIdHeader.click();

  await expect(
    page.getByRole('tooltip', { name: 'Click to sort descending' })
  ).toBeVisible();

  const rowsAsc = page.locator('tbody tr:not(.ant-table-measure-row)');
  const ascCount = await rowsAsc.count();

  const ascIds = [];

  for (let i = 0; i < ascCount; i++) {
    const rowText = await rowsAsc.nth(i).innerText();

    const match = rowText.match(/\b\d{6}\b/); // Mail IDs like 330246

    if (match) {
      ascIds.push(Number(match[0]));
    }
  }

  const expectedAsc = [...ascIds].sort((a, b) => a - b);

  expect(ascIds).toEqual(expectedAsc);

  // DESCENDING SORT
  await mailIdHeader.click();

  const rowsDesc = page.locator('tbody tr:not(.ant-table-measure-row)');
  const descCount = await rowsDesc.count();

  const descIds = [];

  for (let i = 0; i < descCount; i++) {
    const rowText = await rowsDesc.nth(i).innerText();

    const match = rowText.match(/\b\d{6}\b/);

    if (match) {
      descIds.push(Number(match[0]));
    }
  }

  const expectedDesc = [...descIds].sort((a, b) => b - a);

  expect(descIds).toEqual(expectedDesc);

  // Verify toggle actually changed the order
  expect(descIds[0]).toBe(Math.max(...descIds));
  expect(ascIds[0]).toBe(Math.min(...ascIds));
});



//test 29
test('Email details shows selected Ticket Mail ID', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.waitForTimeout(2000);

  await page.getByRole('cell', { name: '330247' }).click();
  await expect(page.getByText('330247', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'EMAIL DETAILS (Ticket MailID: 330247)' })).toBeVisible();
});



//test 30
test('Email body and attachments displayed', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
  await page.locator('#ticketType').fill('mail');
  await page.locator('#ticketType').press('Enter');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).click();
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('329531');
  await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByLabel('Ticket Mail ID').getByRole('button', { name: 'search' }).click();
  await page.locator('.ant-input-affix-wrapper').click();
  await page.getByRole('textbox', { name: 'Search in filters' }).fill('329531');
  await page.waitForTimeout(2000);

  await page.locator('.ant-dropdown-menu-title-content > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').check();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('FW: RTA LMS document for').nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'down' }).click();
  await expect(page.getByText('TestOnshoreForRTA@navbackoffice.com', { exact: true })).toBeVisible();
  await expect(page.locator('#attachment-0')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^test$/ })).toBeVisible();
});

//98
test('View bad conversation comment', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Bad Conversation Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('Bad comment test');
    await page.getByRole('button', { name: 'Add Comment' }).click();

      await page.getByRole('cell', { name: 'flag' }).click();
    await expect(page.getByText('Ticket Bad Conversation')).toBeVisible();
    await expect(page.getByLabel('Ticket Bad Conversation')).toContainText('Bad comment test');
    await page.getByRole('button', { name: 'Cancel' }).click();

      await page.getByRole('cell', { name: 'flag' }).click();
      await page.locator('.ml-5 > .anticon').click();
     await page.getByRole('textbox', { name: 'Enter Comment' }).click();
  await page.getByRole('textbox', { name: 'Enter Comment' }).fill('');
  await page.getByRole('button', { name: 'Update Comment' }).click();
});

//test 31
test('Full screen email details', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.ant-row.ant-row-middle > div').first().click();
  await page.getByRole('cell', { name: '330247' }).click();
    await page.keyboard.press('Shift+E');
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});



//test 32
test('Use Hide/Show Email Analysis button to toggle email analysis component. ', async ({ page }) => {
await page.locator('div').filter({ hasText: /^All Tickets$/ }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).click();
  await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81702');
  await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
  await page.locator('.anticon.anticon-eye > svg').click();
  await page.getByRole('img', { name: 'Info' }).click();
  await page.getByRole('tab', { name: 'Ticket Email Analysis' }).click();
  await expect(page.getByRole('heading', { name: 'Ticket Email Analysis' })).toBeVisible();
});

// test('Delete requires confirmation and comment', async ({ page }) => {
//     await page.getByRole('menuitem', { name: 'All Tickets' }).click();

//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 002');
//   await page.getByRole('textbox', { name: 'Subject' }).press('Enter');

//     const element = page.locator('.anticon.anticon-eye > svg');
//     await element.click();

//     await page.getByRole('row', { name: 'tag Ticket Mail ID Category' }).getByLabel('', { exact: true }).check();
//     await page.getByRole('row', { name: 'tag Ticket Mail ID Category' }).getByLabel('', { exact: true }).press('ControlOrMeta+m');

//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 003');
//     await page.getByRole('dialog').getByRole('button', { name: 'search', exact: true }).click();

//     await page.getByRole('checkbox', { name: 'FA-' }).check();
//     await page.getByRole('button', { name: 'Merge To Target Ticket' }).click();
//     await page.getByRole('textbox', { name: 'Enter comment' }).click();
//     await page.getByRole('textbox', { name: 'Enter comment' }).fill('Testing');
//     await page.getByRole('button', { name: 'Merge' }).first().click();


//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 003');
//     await page.getByRole('button', { name: 'search' }).press('Enter');

//     await element.click();

//     await page.getByRole('row', { name: 'tag Ticket Mail ID Category' }).getByLabel('', { exact: true }).check();
//     await page.getByRole('row', { name: 'edit mail - - 330256 MG' }).getByLabel('', { exact: true }).uncheck();
//     await page.getByRole('row', { name: 'edit mail - - 330255 MG' }).getByLabel('', { exact: true }).uncheck();

//     await page.getByRole('img', { name: 'Split Ticket' }).click();
//     await page.getByRole('textbox', { name: 'Enter Comment' }).click();
//     await page.getByRole('textbox', { name: 'Enter Comment' }).fill('testing');
//     await page.getByRole('button', { name: 'Split' }).nth(1).click();


// });


//79
test('Resolve requires general tags', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 004');
  await page.getByRole('textbox', { name: 'Subject' }).press('Enter');

    const element = page.locator('.anticon.anticon-eye > svg');
    await element.click();

    await page.locator('.anticon.anticon-edit > svg').first().click();

    await page.getByText('Pending Day Reviewer').click();
    await page.getByTitle('Resolved').click();
    await page.locator('[id="save&exit"]').click();

    await expect(page.locator('#root')).toContainText('Please select General Tags. ✖');

    await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').click();
    await page.locator('#ddlGeneralTags').fill('ravik');
    await page.locator('#ddlGeneralTags').press('Enter');
    await page.locator('[id="save&exit"]').click();

    await page.locator('.anticon.anticon-edit > svg').first().click();

    await page.locator('.anticon.anticon-close-circle > svg').click();
    await page.locator('div').filter({ hasText: /^Resolved$/ }).nth(2).click();
    await page.getByTitle('Pending Day Reviewer').click();
    await page.locator('[id="save&exit"]').click();

});



//80
// test('Resolve with optional comment', async ({ page }) => {
//     await page.getByRole('menuitem', { name: 'All Tickets' }).click();

//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 005');
//   await page.getByRole('textbox', { name: 'Subject' }).press('Enter');

//     const element = page.locator('.anticon.anticon-eye > svg');
//     await element.click();

//     const element2 = page.locator('.anticon.anticon-edit > svg')
//     element2.click();

//     await page.getByText('Pending Day Reviewer').click();
//     await page.getByTitle('Resolved').click();
//     await page.locator('[id="save&exit"]').click();

//     await expect(page.locator('#root')).toContainText('Please select General Tags. ✖');

//     await page.locator('.ant-select.w-100.input-box-danger > .ant-select-selector').click();
//     await page.locator('#ddlGeneralTags').fill('ravik');
//     await page.locator('#ddlGeneralTags').press('Enter');

//     await page.getByRole('textbox', { name: 'Enter Comment' }).click();
//     await page.getByRole('textbox', { name: 'Enter Comment' }).fill('Resolved');
//     await page.getByRole('button', { name: 'Add Comment' }).click();


//     await page.locator('[id="save&exit"]').click();

//     element2.click();
//     await page.locator('.anticon.anticon-close-circle > svg').click();
//     await page.locator('div').filter({ hasText: /^Resolved$/ }).nth(2).click();
//     await page.getByTitle('Pending Day Reviewer').click();
//     await page.locator('[id="save&exit"]').click();

// });

//81
// test('Cancel modal with Alt+Shift+X', async ({ page }) => {

//     await page.getByRole('menuitem', { name: 'All Tickets' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).click();
//     await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 006');
//     await page.getByRole('textbox', { name: 'Subject' }).press('Enter');

//     await page.locator('.anticon.anticon-eye > svg').click();
//     await page.locator('.anticon.anticon-more > svg').click();

//     await page.getByRole('menuitem', { name: 'Delete Ticket' }).click();
//     await page.locator('.ant-modal > div').first().press('Alt+Shift+X');
//     await expect(page.locator('span').filter({ hasText: 'RaviAr@navfundservices.com' })).toBeVisible();

//     await page.locator('.anticon.anticon-more > svg').click();
//     await page.getByRole('menuitem', { name: 'Resolve' }).click();
//     await page.locator('.ant-modal > div').first().press('Alt+Shift+X');
//     await expect(page.locator('span').filter({ hasText: 'RaviAr@navfundservices.com' })).toBeVisible();

//     await page.getByRole('row', { name: 'tag Ticket Mail ID Category' }).getByLabel('', { exact: true }).check();
//     await page.locator('.bulk-update').click();
//     await page.locator('.ant-modal > div').first().press('Alt+Shift+X');
//     await expect(page.locator('span').filter({ hasText: 'RaviAr@navfundservices.com' })).toBeVisible();
// });

//82
test('Modal submit with CtrlEnter', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81725');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();


    await page.locator('.anticon.anticon-more > svg').first().click();

await page.getByRole('menuitem', { name: 'Resolve' }).click();

// Check if ravikd is already selected
const ravikdTag = page.getByTitle('ravikd');

if (!(await ravikdTag.isVisible().catch(() => false))) {
    await page.locator('.ant-select-selection-overflow').click();
    await page.locator('#ddlGeneralTags').fill('ravikd');
    await page.locator('#ddlGeneralTags').press('Enter');

    await page.getByRole('button', { name: 'sync' }).click();
}

// Common steps for both cases
await page.getByRole('textbox', { name: 'Enter comment' }).fill('Test');
await page.getByRole('button', { name: 'Yes' }).press('ControlOrMeta+Enter');

// Optional OK popup
const okButton = page.getByRole('button', { name: 'OK' });

try {
    await okButton.waitFor({
        state: 'visible',
        timeout: 3000
    });
    await okButton.click();
} catch {
    console.log('OK popup did not appear');
}

// Success validation for both cases
await expect(page.locator('#root'))
    .toContainText('Ticket has been resolved successfully');

// Modify Ticket
await page.locator('.anticon.anticon-more > svg').first().click();
await page.getByRole('menuitem', { name: 'Modify Ticket' }).click();

await page.locator('.anticon.anticon-close-circle > svg').click();
await page.locator('div').filter({ hasText: /^Resolved$/ }).nth(2).click();
await page.getByTitle('Pending Day Reviewer').click();
await page.locator('[id="save&exit"]').click();

});

//86
test('Select/deselect all attachments', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81279');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.getByText('329531', { exact: true }).click();
    await page.locator('body').press('Alt+ControlOrMeta+s');

    await page.locator('.ant-checkbox.ant-checkbox-checked > .ant-checkbox-input').first().uncheck();

    await page.getByRole('checkbox', { name: 'file TPS general introduction' }).check();
    await page.getByRole('checkbox', { name: 'file Introduction to NAVRTA, Drives & DMS.pptx' }).check();
    await page.getByRole('checkbox', { name: 'file Introduction to NAVRTA, Drives & DMS_Questionnaire.docx' }).check();
    await page.getByRole('checkbox', { name: 'file Introduction to NAVRTA, Drives & DMS_Questionnaire.docx' }).uncheck();
    await page.getByRole('checkbox', { name: 'file Introduction to NAVRTA, Drives & DMS.pptx' }).uncheck();
    await page.getByRole('checkbox', { name: 'file TPS general introduction' }).uncheck();
});


//87
test('Client level ticket requires fund folder', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81725');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Save Location (.eml)' }).click();
    await expect(page.getByLabel('Save Ticket to Location (File').getByRole('mark')).toContainText('Information: This is a client level ticket, you have to select a fund folder to save ticket.');
    await expect(page.getByLabel('Save Ticket to Location (File')).toMatchAriaSnapshot(`- button "Save" [disabled]`);
});

//88
test('Save disabled without folder selection', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81725');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Save Location (.eml)' }).click();
    await expect(page.getByLabel('Save Ticket to Location (File')).toMatchAriaSnapshot(`- button "Save" [disabled]`);
});


//89
test('Add task on received mail', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

    await page.locator('.anticon.anticon-eye > svg').click();
    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Add Task' }).click();
    await page.getByRole('textbox', { name: 'Enter comment' }).click();
    await page.getByRole('textbox', { name: 'Enter comment' }).fill('Task');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('alert')).toContainText(/^ TicketID: FA-81759 has been modified to add a new Task/);
});


//90
test('View existing task', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

    await page.locator('.anticon.anticon-eye > svg').click();

    const element = page.getByText('330339', { exact: true });
    await element.click();
    await element.press('Shift+V');


    await expect(page.locator('h2')).toContainText('Ticket Resolution Window');

});


//91
test('Modify task window', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');

    await page.locator('.anticon.anticon-eye > svg').click();

    const element = page.getByText('330339', { exact: true });
    await element.click();
    await element.press('Alt+M');


    await expect(page.locator('h2')).toContainText('Ticket Resolution Window');

});

//92
test('Add task blocked for Task types', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.locator('div').filter({ hasText: /^Ticket No\.$/ }).nth(3).click();
    await page.getByTitle('Ticket Mail ID').click();
    await page.getByRole('textbox', { name: 'Ticket Mail ID' }).click();
    await page.getByRole('textbox', { name: 'Ticket Mail ID' }).fill('330340');
    await page.getByRole('textbox', { name: 'Ticket Mail ID' }).press('Enter');

    await page.locator('.anticon.anticon-eye > svg').click();
    await page.getByText('330340', { exact: true }).click();
    await page.locator('body').press('Alt+a');
    await expect(page.locator('#root')).toContainText('Add Task option not available. ✖');
});


//93
test('Open ticket comments window', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.locator('body').press('Shift+t');
    await expect(page.getByLabel('Ticket Comments Window (')).toContainText('Ticket Comments Window (TicketID 81759)');
});

//94
test('Post new ticket comment', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.locator('body').press('Shift+t');
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('New Comment');
    await expect(page.getByLabel('Ticket Comments Window (').getByRole('list')).toContainText('New Comment');
});

//95
test('View existing comments list', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81725');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();
      await page.waitForTimeout(2000);

    await page.locator('body').press('Shift+t');
      await page.waitForTimeout(2000);

    await expect(page.getByLabel('Ticket Comments Window (')).toContainText('Ticket Comments Window (TicketID 81725)');
    await expect(page.getByText('AvinashM').first()).toBeVisible();
});

//96
test('Post disabled when comment empty', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.locator('body').press('Shift+t');
    await expect(page.getByLabel('Ticket Comments Window (')).toContainText('Ticket Comments Window (TicketID 81759)');

    const addCommentButton = page.getByRole('button', { name: 'Add Comment' });
    await expect(addCommentButton).toBeDisabled();

});





//106
test('Export ticket conversation', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Testing  Tickets 004');
  await page.getByRole('textbox', { name: 'Subject' }).press('Enter');

   await page.locator('.anticon.anticon-eye > svg').click();
   

    await page.locator('div').filter({ hasText: 'Ticket Conversation (81712' }).nth(5).click();
    await page.locator('body').press('Alt+c');
    await expect(page.getByRole('alert')).toContainText(/^ 3 Ticket Conversation Threads exported successfully to the location/);
});

//108
test('Modal submit Ctrl+Enter for Bulk update', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81712');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.getByRole('row', { name: 'tag Ticket Mail ID Category' }).getByLabel('', { exact: true }).check();
    await page.locator('.bulk-update').click();
    await page.getByText('Select Status').click();
    await page.getByTitle('Pending Day Reviewer').click();
    await page.getByRole('textbox', { name: 'Enter comment' }).click();
    await page.getByRole('textbox', { name: 'Enter comment' }).fill('Bulk update');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.locator('#root')).toContainText('Ticket has been updated successfully✖');


});

//112
test('Shortcut list matches info popover', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81712');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    const element = page.getByRole('img', { name: 'Info' });
    element.hover();
    await expect(page.getByRole('tooltip')).toContainText('Shortcut Keys');
});


//99
test('Edit own bad conversation comment', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'All Tickets' }).click();

    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81759');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.locator('.anticon.anticon-eye > svg').click();

    await page.locator('.anticon.anticon-more > svg').first().click();
    await page.getByRole('menuitem', { name: 'Bad Conversation Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('Bad comment test');

    const btn = page.getByRole('button', { name: 'Add Comment' });
    btn.click()

  await page.getByRole('cell', { name: 'flag' }).click();
    await page.locator('.ml-5 > .anticon > svg').click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('bad comment updated');
    await page.getByRole('button', { name: 'Update Comment' }).click();

    await expect(
        page.locator('div')
            .filter({ hasText: 'TicketID: FA-81759 &' })
            .nth(3)
    ).toContainText(/^ TicketID: FA-81759/);

  await page.getByRole('cell', { name: 'flag' }).click();
    await page.locator('.ml-5 > .anticon > svg').click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).click();
    await page.getByRole('textbox', { name: 'Enter Comment' }).fill('');
    await page.getByRole('button', { name: 'Update Comment' }).click();
});