export async function login(page) {
  await page.goto('http://inslordevv60:8001/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('avinashm');
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(5000);
}