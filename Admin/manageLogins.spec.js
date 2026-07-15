import { test, expect } from '@playwright/test';
import { login } from './utils/login';

async function goToManageLogins(page) {
  const administration = page.getByRole('menuitem', { name: 'Administration' });

  await administration.waitFor({ state: 'visible' });
  await administration.scrollIntoViewIfNeeded();

  // Expand Administration and click Manage Logins in one retry loop —
  // submenu can collapse between separate steps (Ant Design accordion).
  await expect(async () => {
    if ((await administration.getAttribute('aria-expanded')) !== 'true') {
      await administration.click();
    }
    await expect(administration).toHaveAttribute('aria-expanded', 'true');

    const manageLogins = page
      .getByRole('menuitem', { name: 'Manage Logins' })
      .filter({ visible: true });

    await expect(manageLogins).toBeVisible();
    await manageLogins.click();

    await expect(
      page.getByRole('heading', { name: 'Manage Logins' })
    ).toBeVisible();
  }).toPass();
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

//opening the manage login page
test('manage logins page loads', async ({ page }) => {
  await goToManageLogins(page);
});

//searching a name of logined user with there login name
test('search login by existing login name', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Login Name' }).click();
  await page.getByRole('textbox', { name: 'Login Name' }).fill('AakashV');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('AakashV', { exact: true })).toBeVisible();
});

//searching with the wrong login name which does not exist
test('search login by non existing login name', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Login Name' }).click();
  await page.getByRole('textbox', { name: 'Login Name' }).fill('kavyansh');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('No data')).toBeVisible();
});

//searching with email which exists
test('search login by existing email', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('aabha');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('Aabha').first()).toBeVisible();
});

//searching with email which does not exists
test('search login by non existing email', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('kavyansh');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('No data')).toBeVisible();
});

//searching with the Emp ID which exist
test('search login by existing employee id', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Employee ID' }).click();
  await page.getByRole('textbox', { name: 'Employee ID' }).fill('550');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('550')).toBeVisible();
});

//searching with the Emp Id which does not exist
test('search login by non existing employee id', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('textbox', { name: 'Employee ID' }).click();
  await page.getByRole('textbox', { name: 'Employee ID' }).fill('12345');
  await page.getByRole('button', { name: 'search Search' }).click();
  await expect(page.getByText('No data')).toBeVisible();
});

//when searching with the status inactive
test('filter inactive logins shows past dates', async ({ page }) => {
  await goToManageLogins(page);

  await page.getByRole('switch', { name: 'Active' }).click();
  await page.getByRole('button', { name: 'search Search' }).click();

  // Get the date text from UI
  const dateText = await page.locator('text=-01-2023 04:53 PM').textContent();

  // Example format assumption: "DD-MM-YYYY hh:mm AM/PM"
  function parseDate(dateStr) {
    const [datePart, timePart, meridian] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');

    let [hours, minutes] = timePart.split(':');

    // Convert to 24-hour format
    if (meridian === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12;
    }
    if (meridian === 'AM' && hours === '12') {
      hours = '00';
    }

    return new Date(year, month - 1, day, hours, minutes);
  }

  const uiDate = parseDate(dateText.trim());

  const currentDate = new Date();

  // Assertion: UI date should be less than current date
  expect(uiDate.getTime()).toBeLessThan(currentDate.getTime());
});





