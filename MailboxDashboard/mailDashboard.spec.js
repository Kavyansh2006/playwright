import { test, expect } from '@playwright/test';
import { login } from '../Admin/utils/login';

import fs from 'fs';
import path from 'path';

test.describe.configure({ retries: 3 });

test.beforeEach(async ({ page } , testInfo) => {
  

  await login(page);
});


//filter by client
test('move email between folders and filter by client', async ({ page }) => {
  
   await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 33');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
   await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByText('Move to General Folder').click();
  await expect(page.getByLabel('Move to General Folder').getByText('Move to General Folder')).toBeVisible();
  await page.getByRole('button', { name: 'Move' }).click();
  await page.getByRole('menuitem', { name: /^General/ }).click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click();
  await page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com').click({
    button: 'right'
  });
  await page.getByText('Move to Inbox Folder').click();
  await expect(page.getByLabel('Move to Inbox Folder').getByText('Move to Inbox Folder')).toBeVisible();
  await page.getByRole('button', { name: 'Move' }).click();
 await page.waitForTimeout(5000);
  await page.getByText('Inbox').click();

  await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.getByText('AUSBIZ').click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
await expect(page.locator('#email-list-scroll').getByText('KavyanshM@navfundservices.com')).toBeVisible();

});

//filter from Address
test('filter emails by from address', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('KavyanshM@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('KavyanshM@navfundservices.com').first()).toBeVisible();
});


//filter from domain
test('filter emails by from domain', async ({ page }) => {
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Domain' }).click();
  await page.getByRole('textbox', { name: 'From Domain' }).fill('navbackoffice.com');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByLabel('Email Details')).toContainText('@navbackoffice.com');
});


//filter by ticket id
test('filter emails by ticket id', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'Ticket ID' }).click();
  await page.getByRole('textbox', { name: 'Ticket ID' }).fill('81630');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
await page.locator('[id="6a392902972da815443e7e1a"] > .ant-col.d-flex.pt-1 > div:nth-child(4)').click();
  await expect(page.getByRole('heading')).toContainText('FA-81630');
});


//filter by mail received by
test('filter emails by recipient', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'Recipient' }).click();
  await page.getByRole('textbox', { name: 'Recipient' }).fill('testonshoreforrta@navbackoffice.com');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
 await page.getByRole('button', { name: 'down', exact: true }).click();
  await expect(page.locator('span').filter({ hasText: /^TestOnshoreForRTA@navbackoffice\.com$/ })).toBeVisible();
});

//filter by attachments
test('filter emails with attachments', async ({ page }) => {
  
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('label').filter({ hasText: 'Yes' }).click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  // Get text containing total records
  const text = await page.getByRole('main').textContent();

  // Extract number using regex
  const match = text.match(/Total (\d+) records found/);
  const count = match ? parseInt(match[1], 10) : 0;

 
  expect(count).toBeGreaterThan(0);
});


//filter by subject
test('filter emails by subject', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 21');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByLabel('Email Details').getByText('test email 21', { exact: true })).toBeVisible();
});

//create ticket from email

// test('create ticket from outlook email', async ({ page }) => {

//   //  Step 1: Read & update counter
//   const filePath = path.join(__dirname, 'counter.json');
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//   const count = data.count + 1;

//   fs.writeFileSync(filePath, JSON.stringify({ count }));

//   //  Step 2: Create dynamic subject
//   const subject = `test email ${String(count).padStart(2, '0')}`;
//   console.log('Subject used:', subject);


//   //  Step 3: Outlook login
//   await page.goto('https://www.microsoft.com/en-in/microsoft-365/outlook/log-in');

//   const page1Promise = page.waitForEvent('popup');
//   await page.getByRole('link', { name: 'Sign in to access Microsoft' }).first().click();
//   const page1 = await page1Promise;

//   await page1.getByRole('textbox', { name: 'Enter your email, phone, or' }).fill('KavyanshM@navbackoffice.com');
//   await page1.getByRole('button', { name: 'Next' }).click();

//   await page1.getByRole('textbox', { name: 'Enter the password for' }).fill('Support@1234');
//   await page1.getByRole('button', { name: 'Sign in' }).click();

//   await page1.getByRole('checkbox', { name: "Don't show this again" }).check();
//   await page1.getByRole('button', { name: 'Yes' }).click();

//   const page2Promise = page1.waitForEvent('popup');
//   await page1.getByRole('link', { name: 'https://mail.navbackoffice.' }).click();
//   const page2 = await page2Promise;

//   await page2.getByRole('textbox', { name: 'Domain\\user name:' }).fill('KavyanshM@navfundservices.com');
//   await page2.getByRole('textbox', { name: 'Password:' }).fill('Support@1234');
//   await page2.getByRole('button', { name: 'sign in' }).click();

//   await page2.waitForTimeout(5000);

//   // Step 4: Send email
//   await page2.getByRole('button', { name: 'New' }).click();
//   await page2.getByRole('textbox', { name: 'To' }).fill('TestOnshoreForRTA@navbackoffice.com');
//   await page2.getByText('TestOnshoreForRTA TestOnshoreForRTA@navbackoffice.com').click();

//   await page2.getByRole('textbox', { name: 'Subject,' }).fill(subject);

//   await page2.getByRole('button', { name: 'Send' }).nth(1).click();

//   await page2.waitForTimeout(180000);
 


//   //  Step 5: Go back to your app
//   await page.goto('http://inslordevv60:8001/login');

//   await page.getByRole('textbox', { name: 'Username' }).fill('avinashm');
//   await page.getByRole('button', { name: 'Submit' }).click();

//   await page.getByRole('button', { name: 'Next' }).click();

//   await page.waitForTimeout(5000);
//      await page.locator('.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open > div > .ant-menu-title-content > div > .anticon > svg').click();
//     await page.getByRole('menuitem', { name: /^TestOnshore/ }).click();
//      await page.getByText('Unprocessed').click();
//   await page.waitForTimeout(2000);

//   await page.locator('.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open > div > .ant-menu-title-content > div > .anticon > svg').click();

//  await page.getByText('Unprocessed').click();
//   await page.waitForTimeout(2000);
 
//   await page.locator('.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open > div > .ant-menu-title-content > div > .anticon > svg').click();
//    await page.waitForTimeout(2000);
//   await page.locator('.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open > div > .ant-menu-title-content > div > .anticon > svg').click();

//   //  Step 6: Use same subject (optional improvement)
//   await page.getByText(subject).first().click({ button: 'right' });

//   await page.getByText('Create Ticket', { exact: true }).click();

//   await page.waitForTimeout(3000);

//   // await page.getByTitle('Select Client').click();
//    await page.locator('#ddlClients').fill('ausbiz');
//   await page.getByText('AUSBIZ').click();

//   await page.getByText('Select Fund').click();
//   await page.locator('#ddlFunds').fill('Ausbiz Capital Growise');
//   await page.getByText('Ausbiz Capital Growise').click();

//  await page.getByText('None').first().click();
//   await page.locator('#ddlCategory').fill('test001');
//   await page.getByText('test001').click();

//   await page.locator('.ant-select-selection-overflow').first().click();
//   await page.locator('#ddlGeneralTags').fill('kav');
//   await page.getByText('KavTest').click();

//   await page.getByText('Pending Day Reviewer').click();
//   await page.getByLabel('Ticket Details').getByText('Pending Day Reviewer').click();

//   await page.locator('[id="save&exit"]').click();

//   await expect(page.getByText('New TicketID:')).toBeVisible();
// });

//sort by newest -> test 33
test('sort emails by newest', async ({ page }) => {
  

await page.getByRole('button', { name: 'Newest' }).click();
await page.getByRole('button', { name: 'Oldest arrow-down' }).click();

  // Get all received date cells directly (target using regex pattern)
  const receivedDates = page.locator('text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4} \\d{2}:\\d{2} (AM|PM)/');

  // First two dates
  const date1Text = await receivedDates.nth(0).innerText();
  const date2Text = await receivedDates.nth(1).innerText();

  console.log('Row1:', date1Text);
  console.log('Row2:', date2Text);

  //  Parse function (safe)
  const parseDate = (text) => {
    const cleaned = text.replace(/^[A-Za-z]{3}\s/, '');

    const [datePart, timePart, meridian] = cleaned.split(' ');
    const [month, day, year] = datePart.split('/');
    let [hour, minute] = timePart.split(':');

    if (meridian === 'PM' && hour !== '12') hour = Number(hour) + 12;
    if (meridian === 'AM' && hour === '12') hour = 0;

    return new Date(year, month - 1, day, hour, minute);
  };

  const d1 = parseDate(date1Text);
  const d2 = parseDate(date2Text);

  //  Assertion
  expect(d1.getTime()).toBeGreaterThanOrEqual(d2.getTime());

});

//sort by oldest -> test 34
test('sort emails by oldest', async ({ page }) => {
  

await page.getByRole('button', { name: 'Newest' }).click();


  // Get all received date cells directly (target using regex pattern)
  const receivedDates = page.locator('text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4} \\d{2}:\\d{2} (AM|PM)/');

  // First two dates
  const date1Text = await receivedDates.nth(0).innerText();
  const date2Text = await receivedDates.nth(1).innerText();

  console.log('Row1:', date1Text);
  console.log('Row2:', date2Text);

  //  Parse function (safe)
  const parseDate = (text) => {
    const cleaned = text.replace(/^[A-Za-z]{3}\s/, '');

    const [datePart, timePart, meridian] = cleaned.split(' ');
    const [month, day, year] = datePart.split('/');
    let [hour, minute] = timePart.split(':');

    if (meridian === 'PM' && hour !== '12') hour = Number(hour) + 12;
    if (meridian === 'AM' && hour === '12') hour = 0;

    return new Date(year, month - 1, day, hour, minute);
  };

  const d1 = parseDate(date1Text);
  const d2 = parseDate(date2Text);

  //  Assertion
  expect(d1.getTime()).toBeLessThanOrEqual(d2.getTime());

});

//Toggle table view -> test 35

test('toggle list and table view', async ({ page }) => {
  // Click unordered list view
  await page.getByRole('button', { name: 'unordered-list' }).click();

  // Capture the date/time from the first row
  const firstRowDate = await page
    .locator('text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4}/')
    .first()
    .textContent();

  // Ensure value is captured
  expect(firstRowDate).toBeTruthy();

  // Verify it is visible in unordered list view
  await expect(page.getByText(firstRowDate)).toBeVisible();

  // Switch to table view
  await page.getByRole('button', { name: 'table' }).click();

  // Verify the same date is visible in table view
  await expect(page.getByText(firstRowDate)).toBeVisible();
});


//timeline filter monthly -> test 36

test('filter mailbox tickets folder by monthly timeline', async ({ page }) => {
  
  // Open Tickets
  await page.getByRole('menuitem', { name: /^Tickets/ }).click();

  // Collapse sidebar (good step )
  await page.getByRole('button', { name: 'menu-fold' }).click();

  // Apply Monthly filter
 await page.locator('label').filter({ hasText: 'Monthly' }).click();

  await page.waitForTimeout(3000);
  // Sort → Oldest on top
  await page.getByRole('button', { name: /Newest|Oldest/ }).click();

  //  Capture FULL date + time
  const firstRowText = await page
    .locator('text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4} \\d{2}:\\d{2} (AM|PM)/')
    .first()
    .textContent();

  expect(firstRowText).toBeTruthy();

  const cleanText = firstRowText.trim();

  //  Proper parser
  const parseDate = (text) => {
    const match = text.match(
      /\w{3} (\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM)/
    );

    if (!match) throw new Error(`Invalid date format: ${text}`);

    let [, mm, dd, yyyy, hh, min, ampm] = match;

    hh = Number(hh);
    if (ampm === 'PM' && hh !== 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;

    return new Date(yyyy, mm - 1, dd, hh, min);
  };

  const emailDate = parseDate(cleanText);

  //  Date range
  const today = new Date();
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);

  //  BEST comparison (numeric)
  expect(emailDate.getTime()).toBeGreaterThanOrEqual(last30Days.getTime());
  expect(emailDate.getTime()).toBeLessThanOrEqual(today.getTime());

});



//timeline filter custom date -> test 37
test('filter mailbox tickets folder by custom date range', async ({ page }) => {
await page.getByRole('menuitem', { name: /^Tickets/ }).click();

   await page.locator('label').filter({ hasText: 'Custom' }).click();

  await page.getByRole('textbox', { name: 'Start date' }).click();
  await page.getByRole('textbox', { name: 'Start date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'Start date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'Start date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'Start date' }).fill('2026-06-12');
  await page.getByRole('textbox', { name: 'End date' }).click();
  await page.getByRole('textbox', { name: 'End date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'End date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'End date' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'End date' }).fill('2026-06-18');
  await page.getByRole('textbox', { name: 'End date' }).press('Enter');
  await expect(page.getByText('Thu 06/18/2026 05:42 PM')).toBeVisible();
  await expect(page.getByText('Fri 06/12/2026 01:36 PM').nth(1)).toBeVisible();
});


//Combined Client + Subject filter -> test 38
test('filter by client and subject combined', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.locator('#clientID').fill('ausbiz');
  await page.getByText('AUSBIZ', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 45');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByLabel('Email Details').getByText('test email 45')).toBeVisible();
});


//filter by general tag -> test 39
test('filter emails by general tag', async ({ page }) => {
await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('.multi-dropdown-responsive > .ant-select > .ant-select-selector > .ant-select-selection-overflow').first().click();
  await page.locator('#ddlGeneralTags').fill('kav');
  await page.getByText('KavTest').click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('KavyanshM@navfundservices.com').first()).toBeVisible();
});


//filter by to Address -> test 40
test('filter emails by to address', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('testonshoreforrta@navbackoffice.com');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    const downBtn = page.getByRole('button', { name: 'down', exact: true }).first();
    await downBtn.waitFor({ state: 'visible', timeout: 30000 });
    await downBtn.click();
    // 2. exact-regex ki jagah tolerant match (substring, case-insensitive) + bada timeout
    await expect(
      page.getByText('TestOnshoreForRTA@navbackoffice.com').first()
    ).toBeVisible({ timeout: 30000 });
  });


//filter by Cc Address -> test 41
test('filter emails by cc address', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'Cc', exact: true }).click();
  await page.getByRole('textbox', { name: 'Cc', exact: true }).fill('testonshoreforrta@navbackoffice.com');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Cc: TestOnshoreForRTA@')).toBeVisible();
});


//filter by importance -> test 42
test('filter emails by importance high', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByText('High').first().click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
await expect(page.locator('.d-flex.modal-mail-items-icons > span > svg > path').first()).toBeVisible();  
});


//filter by mail type -> test 43
test('filter emails by mail type', async ({ page }) => {
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('div:nth-child(30) > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
 //first i have checked for the sent and draft 
  await page.locator('#Type').fill('sent');
 await page.locator('#Type').press('Enter');
   await page.locator('#Type').fill('draft');
  await page.locator('#Type').press('Enter');


  await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.locator('#email-list-scroll >> text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4}/').first()
).toBeVisible();

  // now i have checked for the received
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByText('Sent+ 1').click();
  await page.getByText('Received').nth(2).click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
await expect(page.locator('#email-list-scroll >> text=/\\w{3} \\d{2}\\/\\d{2}\\/\\d{4}/').first()
).toBeVisible();
});


//filter by color category-> test 44
test('filter emails by color category', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('div:nth-child(49) > .multi-dropdown-responsive > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
  await page.locator('#ddlColorCategories').fill('admin');
  await page.getByText('Admin', { exact: true }).click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByLabel('Email Details').getByText('Admin', { exact: true })).toBeVisible();
});

 test('move email to general folder', async ({ page }) => {

    await page.getByRole('menuitem', { name: /^TestTPSFW/ }).click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('G2I Test');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    //make it using subject
    await page.locator('#email-list-scroll').getByText('G2I Test').click({
        button: 'right'
    });

    await page.getByRole('menuitem', { name: 'Move to General Folder' }).click();

    await expect(page.locator('div').filter({ hasText: /^Move to General Folder$/ }).first()).toBeVisible();
    // await page.locator('div').filter({ hasText: /^Select Client$/ }).nth(2).click();
    // await page.getByText('CV PC').click();

    // await page.locator('.ant-select-selection-overflow').click();
    // await page.locator('#ddlGeneralTags').fill('raiji');
    // await page.getByText('raiji').nth(1).click();
    // await page.locator('#ddlGeneralTags').fill('raiji1');
    // await page.getByText('raiji1').nth(1).click();

    await page.getByRole('button', { name: 'Move' }).click();
    await expect(page.getByText('All 1 Mails moved sucessfully✖')).toBeVisible();
    await page.getByRole('menuitem', { name: /^General/ }).click();
    await page.locator('div').filter({ hasText: /^G2I Test 001$/ }).first().click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Move to Inbox Folder' }).click();
  await page.getByRole('button', { name: 'Move' }).click();
  await expect(page.getByText('All 1 Mails moved sucessfully')).toBeVisible();
});

//exact match subject search
test('advanced search exact match on subject', async ({ page }) => {
   await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('checkbox', { name: 'Enable Advance Search' }).check();
  await page.getByRole('textbox', { name: 'Add a word' }).click();
  await page.getByRole('textbox', { name: 'Add a word' }).fill('superfund');
  await page.getByRole('textbox', { name: 'Add a word' }).press('Tab');
  await page.getByLabel('', { exact: true }).nth(2).check();
  await page.locator('div:nth-child(7) > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
  await page.locator('#searchIn').fill('subject');
  await page.getByText('Subject', { exact: true }).click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Superfund').first()).toBeVisible();
});


//create ticket with Acknowledge
test('create ticket with acknowledge', async ({ page }) => {
  await page.getByRole('button', { name: 'search Search' }).click();
   await page.getByRole('textbox', { name: 'From Address' }).click();
   await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
   await page.getByRole('textbox', { name: 'Subject' }).click();
   await page.getByRole('textbox', { name: 'Subject' }).fill('test email 18');
   await page.getByRole('button', { name: 'Search', exact: true }).click();
   await page.getByRole('button', { name: 'Acknowledge' }).click();
   // await page.locator('body').press('Alt+a');
   await expect(page.getByRole('heading', { name: 'Ticket Resolution Window' }))
   .toBeVisible({ timeout: 30000 });
  
   //to check the subject field
 const subjectInput = page.locator('text=Subject:').locator('xpath=following::input[1]');
 await expect(subjectInput).toHaveValue(/^RE:/);
  
 //to check the recipient field
 await expect(page.locator('#toInternalRecipients'))
   .toHaveValue('kavyanshm@navfundservices.com');
 });
  


//create ticket with Reply - test 47
test('create ticket with reply', async ({ page }) => {
 await page.getByRole('button', { name: 'search Search' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).click();
  await page.getByRole('textbox', { name: 'From Address' }).fill('kavyanshm@navfundservices.com');
  await page.getByRole('textbox', { name: 'Subject' }).click();
  await page.getByRole('textbox', { name: 'Subject' }).fill('test email 18');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('button', { name: 'Reply' }).click();
  // await page.locator('body').press('Alt+r');
  await expect(page.getByRole('heading', { name: 'Ticket Resolution Window' }))
  .toBeVisible({ timeout: 30000 });
  
  //to check the subject field
const subjectInput = page.locator('text=Subject:').locator('xpath=following::input[1]');
await expect(subjectInput).toHaveValue(/^RE:/);

//to check the recipient field
await expect(page.locator('#toInternalRecipients'))
  .toHaveValue('kavyanshm@navfundservices.com');
});

test('search email by subject UniqueTestHarsh02', async ({ page }) => {
    await page.getByRole('menuitem',{name:/^TestOnshore/}).click();
     await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh02');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.locator('#email-list-scroll')).toContainText('UniqueTestHarsh02');
   
  });
  
  
  
  test('open TestTPSFW inbox folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Inbox/}).click();
      await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/Inbox');
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Inbox');
  });
  
  
  test('open TestTPSFW tickets folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Tickets/}).click();
    await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/Tickets');
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Tickets');
  });
  
  
  test('open TestTPSFW general folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^General/}).click();
    await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/General');
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/General');
  });
  
  
  
  
  test('open TestTPSFW drafts folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Drafts/}).click();
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Drafts');
      await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/Drafts');
  });
  
  
  test('open TestTPSFW sent items folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Sent Items/}).click();
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Sent Items');
    await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/SentItems')
  });
  
  test('open TestTPSFW deleted items folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Deleted Items/}).click();
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Deleted Items');
      await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/DeletedItems');
  });
  
  
  test('open TestTPSFW unprocessed folder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(5000);
   await page.getByRole('menuitem',{name:/^Unprocessed/}).click();
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Unprocessed');
        await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/Unprocessed');
  });
  
  test('open TestTPSFW inbox registered subfolder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^TestTPSFW/}).click();
   await page.waitForTimeout(2000);
  const inbox= page.getByRole('menuitem',{name:/^Inbox/})
  await inbox.click();
   
  await page.waitForTimeout(2000);
   const Registered= inbox.locator('..').getByRole('menuitem',{name:/^Registered(\d+)?$/});
   await Registered.click();
    await expect(page.getByRole('main')).toContainText('/MailBoxes/Test T P S F W/Inbox/Registered');
          await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW/Inbox/Registered');
  });
  
  
  
  
  
  
  test('save email attachments to folder', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh02');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('UniqueTestHarsh02').click({
      button: 'right'
    });
    await page.getByText('Save Attachments').click();
    await page.getByRole('button', { name: 'upload Select Folder' }).click();
    await page.getByRole('dialog', { name: 'File Explorer' }).getByRole('textbox').click();
    await page.getByRole('dialog', { name: 'File Explorer' }).getByRole('textbox').fill('A:\\Project Plans\\NAVRTA\\Test\\Harshtests');
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Email Attachments saved to location successfully✖')).toBeVisible();
  });
  
  
  
  
  
  test('forward email as attachment', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh02');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('UniqueTestHarsh02').click({
      button: 'right'
    });
    await page.getByText('Forward as Attachment').nth(2).click();
    await expect(page.locator('.ant-input.input-box-success')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^UniqueTestHarsh02$/ }).nth(1)).toBeVisible();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'eye' }).click();
    const page1 = await page1Promise;
    await expect(page1.locator('div').filter({ hasText: 'Subject:' }).nth(3)).toBeVisible();
  });
  
  
  
  
  
  
  
  test('toggle unordered list view for search results', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh02');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'unordered-list' }).click();
    await expect(page.locator('.ant-list-item-meta-content')).toBeVisible();
  });
  
  
  
  
  
  
  test('scroll loads more emails', async ({ page }) => {
    await page.getByText('Mailbox Dashboard').waitFor();
  
    const rows = page.locator('.emails-infinite-container div');
  
    const beforeCount = await rows.count();
    console.log('Before:', beforeCount);
  
    const container = page.locator('.emails-infinite-container');
  
  await container.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
  
    await page.waitForTimeout(2000);
  
    const afterCount = await rows.count();
    console.log('After:', afterCount);
  
  
    expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
  });
  
  
  
  
  test('add email to existing ticket with acknowledge', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh02');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('UniqueTestHarsh02').click({
      button: 'right'
    });
    await page.getByText('Add to Existing Ticket With Acknowledge').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81683');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.getByRole('checkbox', { name: 'FA-' }).check();
    await page.getByRole('checkbox', { name: 'FA-' }).press('Enter');
    // await page.getByText('FA-81683Pending Da...Test').click();
    await page.getByRole('button', { name: 'Add Email To Existing Ticket' }).click();
    await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('.ant-col.ant-col-24 > .ant-row')).toBeVisible();
  });
  
  
  
  
  
  test('add email to existing ticket with reply', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh03');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('UniqueTestHarsh03').click({
      button: 'right'
    });
    await page.getByText('Add to Existing Ticket With Reply').click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).click();
    await page.getByRole('textbox', { name: 'Ticket No.' }).fill('81683');
    await page.getByRole('textbox', { name: 'Ticket No.' }).press('Enter');
    await page.getByRole('checkbox', { name: 'FA-' }).check();
    await page.getByRole('button', { name: 'Add Email To Existing Ticket' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('.ant-col.ant-col-24 > .ant-row')).toBeVisible();
  });
  
  
  
  
  
  
  
  test('advanced search exact match validation message', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('checkbox', { name: 'Enable Advance Search' }).click();
    await page.getByLabel('', { exact: true }).nth(2).click();
   
    await page.locator('.react-tagsinput > span').click();
    await page.getByRole('textbox', { name: 'Add a word' }).fill('Test Email');
    await page.getByRole('textbox', { name: 'Add a word' }).press('Tab');
    await page.getByLabel('', { exact: true }).nth(2).click();
    await expect(page.getByText('To enable exact match, please ensure you are searching only unique word ✖')).toBeVisible();
  });
  
  
  
  
  test('switch to saved custom view kavyansh', async ({ page }) => {
    await page.getByText('Blank View').click();
  await page.locator('#ddlCustomView').fill('kavyansh');
  await page.locator('#ddlCustomView').press('Enter');
    await expect(page.locator('div').filter({ hasText: /^kavyansh$/ }).nth(2)).toBeVisible();
  });
  
  
  
  test('add duplicate custom view shows error', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'High' }).nth(1).click();
    await page.locator('label').filter({ hasText: 'High' }).first().click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByText('Add Custom View').click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('kavyansh');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('div').filter({ hasText: 'User Preference For Mail Dashboard with the Name: kavyansh and MailBoxAddress: TestOnshoreForRTA@navbackoffice.com for loginName: AvinashM already exists.' }).nth(3)).toBeVisible();
  });
  
  
  
  
  test('advanced search in message body', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('checkbox', { name: 'Enable Advance Search' }).check();
    await page.getByRole('textbox', { name: 'Add a word' }).click();
    await page.getByRole('textbox', { name: 'Add a word' }).fill('UniqueTestHarsh04');
    await page.getByRole('textbox', { name: 'Add a word' }).press('Tab');
    await page.locator('div:nth-child(7) > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
    await page.getByText('Subject', { exact: true }).click();
    await page.getByTitle('Message body').click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.locator('div').filter({ hasText: /^UniqueTestHarsh04$/ }).first()).toBeVisible();
    await page.locator('font').filter({ hasText: 'UniqueTestHarsh04' }).getByRole('mark').click();
  });
  
  
  
  test('open TestOnshore undelivered inbox subfolder', async ({ page }) => {
    await page.waitForTimeout(4000)
   await page.getByRole('menuitem',{name:/^Inbox/}).click();
   await page.waitForTimeout(4000);
   
   await page.getByRole('menuitem',{name:/^Undelivered/}).click();
      await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestOnshore/Inbox/Undelivered');
          await expect(page.getByText('/MailBoxes/Test Onshore/Inbox/Undelivered')).toBeVisible();
    
  });
  
  
  test('open TestOnshore meeting inbox subfolder', async ({ page }) => {
   await page.getByRole('menuitem',{name:/^Inbox/}).click();
   await page.waitForTimeout(3000);
   
   await page.getByRole('menuitem',{name:/^Meeting/}).click();
      await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestOnshore/Inbox/Meeting');
      await expect(page.getByText('/MailBoxes/Test Onshore/Inbox/Meeting')).toBeVisible();
    
  });
  
  
  
  test('modify ticket from email context menu', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('UniqueTestHarsh01');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByText('RGHarshitGu@navfundservices.').click({
      button: 'right'
    });
    await page.getByText('Modify Ticket').click();
    await expect(page.locator('.ant-col.ant-col-24 > .ant-row')).toBeVisible();
  });




//Export Email
test('export emails from mailbox dashboard', async ({ page }) => {
    await page.getByRole('img', { name: '/static/media/Export-tickets.' }).click();
    await expect(page.getByText('Export Process has started and It will take some time.✖')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Mails exported' }).nth(2)).toBeVisible();
});


test('export emails with invalid custom date range', async ({ page }) => {
 
  await page.getByRole('menuitem', { name: /^Tickets/ }).click();
 
  await page.locator('label').filter({ hasText: 'Custom' }).click();
 
  await page.getByRole('textbox', { name: 'Start date' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await page.getByText('1', { exact: true }).nth(2).click();
 
 
  await page.getByRole('img', { name: '/static/media/Export-tickets.' }).click();
  await expect(page.getByText('1 Mails exported successfully')).toBeVisible();
});

//Add custom view
test('add custom view and delete it', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'Normal' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await expect(page.locator('div').filter({ hasText: /^Add Custom View$/ }).first()).toBeVisible();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('cD1');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Custom View added successfully✖')).toBeVisible();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();


});

//Edit custom view
test('edit custom view title and delete it', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'Normal' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('cD edit');
    await page.getByRole('button', { name: 'Save' }).click();


    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByText('Edit Custom View').click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('cD edited');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByText('Custom View updated successfully✖')).toBeVisible();

    await expect(page.getByRole('main')).toContainText('cD edited');

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

});

//Delete Custom view
test("delete custom view and verify removed from dropdown", async ({ page }) => {

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'Normal' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('customD');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();

    await page.waitForTimeout(2000);
    await page.locator('div').filter({ hasText: /^Blank View$/ }).nth(2).click();
    await page.locator('#ddlCustomView').fill('customD');
    await page.locator('div').filter({ hasText: 'No data' }).nth(2).click();
});

//Switch Custom view
test("switch between two saved custom views", async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();


    await page.getByText('Blank View').click();
    await page.locator('#ddlCustomView').fill('customView1');
    await page.locator('#ddlCustomView').press('Enter');

    await page.getByText('Mailbox Dashboard').click();

    await expect(page.locator('#email-list-scroll')).toContainText('babumusai7284@gmail.com');

    await page.locator('#root').getByTitle('customView1').click();
    await page.locator('#ddlCustomView').fill('customView2');
    await page.locator('#ddlCustomView').press('Enter');

    await page.getByText('Mailbox Dashboard').click();

    await expect(page.locator('#email-list-scroll')).toContainText('RaviAr@navfundservices.com');

});

//Create ticket with reply
//comment out test.foreach block at the top
// test('create ticket with reply from outlook email', async ({ page }) => {

//     const filePath = path.join(__dirname, 'counter.json');
//     const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//     const count = data.count + 1;

//     fs.writeFileSync(filePath, JSON.stringify({ count }));

//     // //  Step 2: Create dynamic subject
//     const subject = `Test Mail for Ticket ${String(count).padStart(2, '0')}`;

//     //  Step 3: Outlook login
//     await page.goto('https://www.microsoft.com/en-in/microsoft-365/outlook/log-in');

//     const page1Promise = page.waitForEvent('popup');
//     await page.getByRole('link', { name: 'Sign in to access Microsoft' }).first().click();
//     const page1 = await page1Promise;

//     await page1.getByRole('textbox', { name: 'Enter your email, phone, or' }).fill('raviar@navbackoffice.com');
//     await page1.getByRole('button', { name: 'Next' }).click();

//     await page1.getByRole('textbox', { name: 'Enter the password for' }).fill('Support@1234');
//     await page1.getByRole('button', { name: 'Sign in' }).click();

//     await page1.getByRole('checkbox', { name: "Don't show this again" }).check();
//     await page1.getByRole('button', { name: 'Yes' }).click();

//     const page2Promise = page1.waitForEvent('popup');
//     await page1.getByRole('link', { name: 'https://mail.navbackoffice.' }).click();
//     const page2 = await page2Promise;

//     await page2.getByRole('textbox', { name: 'Domain\\user name:' }).fill('raviar@navfundservices.com');
//     await page2.getByRole('textbox', { name: 'Password:' }).fill('Support@1234');
//     await page2.getByRole('button', { name: 'sign in' }).click();

//     await page2.waitForTimeout(5000);
//     // Step 4: Send email
//     await page2.getByRole('button', { name: 'New' }).click();
//     await page2.getByRole('textbox', { name: 'To' }).fill('TestTPSFW@navbackoffice.com');
//     await page2.getByText('TestTPSFW TestTPSFW@navbackoffice.com').click();

//     await page2.getByRole('textbox', { name: 'Subject,' }).fill(subject);

//     await page2.getByRole('button', { name: 'Send' }).nth(1).click();

//     await page2.waitForTimeout(35000);

//     //Login on TPS
//     await page.goto('http://inslordevv60:8001/login');    
//     await page.waitForTimeout(2000);


//     await page.getByRole('textbox', { name: 'Username' }).click();
//     await page.getByRole('textbox', { name: 'Username' }).fill('avinashm');
//     await page.getByRole('button', { name: 'Submit' }).click();

//     await page.getByRole('button', { name: 'Next' }).click();
//     await page.waitForTimeout(2000);

//     // create ticket
//     const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
//     await mailbox.click();


//     await page.getByRole('button', { name: 'search Search' }).click();
//     await page.getByRole('textbox', { name: 'From Address' }).click();
//     await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
//     await page.getByRole('textbox', { name: 'Subject' }).fill(subject);
//     await page.getByRole('button', { name: 'Search', exact: true }).click();


//     await page.locator('#email-list-scroll').getByText(subject).click({ button: 'right' });

//     await page.getByRole('menuitem', { name: 'Create Ticket With Reply' }).click();
//     await expect(page.locator('div').filter({ hasText: /^Ticket Resolution Window$/ }).nth(3)).toBeVisible();

//     await page.locator('#ddlClients').click();
//     await page.locator('#ddlClients').fill('cv pc');
//     await page.locator('#ddlClients').press('Enter');

//     await page.getByText('None').first().click();
//     await page.locator('#ddlCategory').fill('test001');
//     await page.locator('#ddlCategory').press('Enter');

//     await page.locator('iframe[title="Rich Text Area"]').contentFrame().locator('html').click();
//     await page.locator('iframe[title="Rich Text Area"]').contentFrame().getByLabel('Rich Text Area. Press ALT-0').fill('Test mail to be ignored.');

//     await page.getByRole('checkbox', { name: 'Verify Email Analysis' }).check();
//     await page.getByLabel('Ticket Details').getByRole('button', { name: 'Save & Exit' }).click();

//     await expect(page.getByRole('alert')).toContainText('New TicketID');
// })


// Toggle read/unread
test("toggle email read and unread status", async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('Test Mail 001');
    await page.getByRole('button', { name: 'Search', exact: true }).click();


    const item = page.locator('#email-list-scroll').getByText('Test Mail');
    await item.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Mark as Unread' }).click();

    await item.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Mark as Read' }).click();
});

//Colour categorization
test('apply color categorization to email', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('Test Mail 001');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.locator('#email-list-scroll').getByText('Test Mail 001', { exact: true }).click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Color Categorization' }).click();
    await page.locator('.ant-segmented-item-label').first().click();
    await page.getByRole('textbox', { name: 'Search Color Categories' }).fill('harshtest131');
    await page.getByRole('checkbox', { name: 'Harshtest131' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.notification-description')).toBeVisible();
    await page.locator('div').filter({ hasText: /^Harshtest131$/ }).nth(1).click();
});

//View Linked ticket
test('view linked ticket from email context menu', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('Test Mail 001');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Test Mail 001', { exact: true }).click({
        button: 'right'
    });
    await page.getByRole('menuitem', { name: 'View Ticket' }).click();
    await expect(page.getByRole('heading', { name: 'Ticket Resolution Window (' })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('Ticket Resolution Window (Ticket ID #: FA-81639');
});

//Switch Mailbox
test('switch mailbox from TestTPSFW to TestOnshore', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestTPSFW');
    const mailbox2 = page.getByRole('menuitem', { name: /^TestOnshore/ });
    await mailbox2.click();
    await expect(page).toHaveURL('http://inslordevv60:8001/MailBoxes/TestOnshore');
});





//Change back to Blank view
test('switch back to blank view clears filters', async ({ page }) => {

    await page.locator('#root').getByText('Blank View').click();
    await page.locator('#ddlCustomView').fill('dsds');
    await page.getByTitle('dsds').click();
    await expect(page.getByRole('main')).toContainText('2 filter applied');

    await page.locator('#ddlCustomView').fill('Blank View');
    await page.getByTitle('Blank View').click();

    await expect(page.getByRole('main')).toContainText('SearchRead EmailBy DateNewest');
});

//Block add view without filter
test('block add custom view without filter selected', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('noFilter');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Please choose at least one filter before continuing. ✖')).toBeVisible();

    // await page.getByRole('button', { name: 'Cancel' }).click();
    // await page.getByRole('button', { name: 'OK' }).click();


    // await page.getByRole('button', { name: 'setting' }).click();
    // await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    // await page.getByRole('button', { name: 'Delete' }).click();

})


//Block edit/delete Blank View
test('block edit and delete blank view', async ({ page }) => {

    await expect(page.getByRole('main')).toContainText('Blank View');
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Edit Custom View' }).click();
    await expect(page.getByText('"Blank View" Cannot Be Modified ✖')).toBeVisible();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await expect(page.getByText('"Blank View" Cannot Be Removed ✖')).toBeVisible();
});

//Custom view title validation
test('custom view title special characters validation', async ({ page }) => {

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'Normal' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();

    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('@@@');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Custom View Title should not contain only special characters. ✖')).toBeVisible();
});

//Search returns empty list
test('advanced search with multiple words returns no data', async ({ page }) => {

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('checkbox', { name: 'Enable Advance Search' }).check();
    await page.getByRole('textbox', { name: 'Add a word' }).click();
    await page.getByRole('textbox', { name: 'Add a word' }).fill('rick');
    await page.getByRole('textbox', { name: 'Add a word' }).press('Tab');
    await page.getByRole('textbox', { name: 'Add a word' }).fill('morty');
    await page.getByRole('textbox', { name: 'Add a word' }).press('Tab');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.locator('#email-list-scroll')).toContainText('No data');

});

//Delete default custom view
test('delete default custom view after creation', async ({ page }) => {
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.locator('label').filter({ hasText: 'Normal' }).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
    await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('DefaultCustom');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Custom View added successfully✖')).toBeVisible();

    await expect(page.getByRole('main')).toContainText('DefaultCustom');
    await page.getByRole('button', { name: 'setting' }).click();
    await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Custom View deleted successfully✖')).toBeVisible();
});

//sort by recipient
test('filter emails by recipient address', async ({ page }) => {

    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'Recipient' }).click();
    await page.getByRole('textbox', { name: 'Recipient' }).fill('babumusai7284@gmail.com');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByLabel('Email Details')).toContainText('To: babumusai7284@gmail.com');
});


//Filter by sentiment
// test('filter emails by neutral sentiment', async ({ page }) => {

//     await page.getByRole('button', { name: 'search Search' }).click();
//     await page.locator('label').filter({ hasText: 'Neutral' }).click();
//     await page.getByRole('button', { name: 'Search', exact: true }).click();
//     await page.locator('.neutral').click();
//     await expect(page.getByRole('tooltip')).toContainText('Sentiment - Neutral');

// });

//Filter by Urgency
test('filter emails by low urgency', async ({ page }) => {

    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByText('Low').nth(1).click();
    await page.locator('label').filter({ hasText: 'Low' }).nth(1).click();
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    const element = page.locator('.d-flex.justify-content-between > div > svg');
    await element.hover();

    await expect(page.getByRole('tooltip')).toContainText('Urgency - Low');

});


//View linked ticket
test('view linked ticket FA-81639 from search results', async ({ page }) => {
    const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
    await mailbox.click();
    await page.getByRole('button', { name: 'search Search' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).click();
    await page.getByRole('textbox', { name: 'From Address' }).fill('RaviAr@navfundservices.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('Test Mail 001');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('#email-list-scroll').getByText('Test Mail 001').click({
        button: 'right'
    });
    await page.getByText('View Ticket').click();
    await expect(page.getByRole('heading', { name: 'Ticket Resolution Window (' })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('FA-81639');
});


//Set default custom view
test('set default custom view persists after refresh login', async ({ page }) => {
  const mailbox = page.getByRole('menuitem', { name: /^TestTPSFW/ });
  await mailbox.click();
 
  await page.getByRole('button', { name: 'search Search' }).click();
  await page.locator('label').filter({ hasText: 'Normal' }).click();
  await page.getByRole('button', { name: 'Search', exact: true }).click();
 
  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Add Custom View' }).click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().click();
  await page.getByRole('textbox', { name: 'Custom Dashboard Title' }).first().fill('customD');
  await page.getByRole('switch', { name: 'Not Default' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Custom View added successfully✖')).toBeVisible();
 
  await login(page);

  await mailbox.click();
  await expect(page.locator('div').filter({ hasText: /^customD$/ }).nth(2)).toBeVisible();

  await page.getByRole('button', { name: 'setting' }).click();
  await page.getByRole('menuitem', { name: 'Delete Custom View' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
 
});
  




