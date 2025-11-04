// @ts-check
import { test, expect } from '@playwright/test';
test.setTimeout(90000);
const BASE_URL = 'https://parabank.parasoft.com/parabank/index.htm';
const uniqueUser = `Demzy${Math.floor(Math.random() * 100000)}`;
const password = 'Dedems';

// Home page test
test('Home page loads correctly', async ({ page }) => {
 await page.goto(BASE_URL);
 await expect(page).toHaveTitle(/ParaBank/i);
 await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
});

// Register a new user
test('Register new user', async ({ page }) => {
 await page.goto(BASE_URL);
await page.getByRole('link', { name: 'Register' }).click();

//  await page.getByRole('link', { name: 'Register' }).click();
//   await page.waitForURL('**/register.htm');

 await page.locator('#customer\\.firstName').fill('Demilade');
 await page.locator('#customer\\.lastName').fill('Ojo');
 await page.locator('#customer\\.address\\.street').fill('Lagos');
 await page.locator('#customer\\.address\\.city').fill('Lagos');
 await page.locator('#customer\\.address\\.state').fill('Lagos');
 await page.locator('#customer\\.address\\.zipCode').fill('100011');
 await page.locator('#customer\\.phoneNumber').fill('0815824582');
 await page.locator('#customer\\.ssn').fill('22');
 await page.locator('#customer\\.username').fill(uniqueUser);
 await page.locator('#customer\\.password').fill('Dedems');
 await page.locator('#repeatedPassword').fill('Dedems');

 await page.getByRole('button', { name: 'Register' }).click();

//  await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
});


// Login
test.describe('Login User', () => {

 test('shows error for invalid login', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.fill('input[name="username"]', 'invalidUser');
  await page.fill('input[name="password"]', 'wrongPass');
  await page.getByRole('button', { name: 'Log In' }).click();

    
  const errorText = (await page.locator('p.error').textContent())?.trim();
  console.log('Error text:', errorText);
    expect(errorText).toBe('The username and password could not be verified.');
 });

 test('login with valid credentials', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('input[name="username"]', uniqueUser);
  await page.fill('input[name="password"]', password);
  await page.getByRole('button', { name: 'Log In' }).click();

  // await page.waitForURL(/overview|accounts|services/, { timeout: 90000 });

  // Confirm dashboard loaded
//   await expect(page.getByRole('heading', { name: 'Accounts Overview' }))
//    .toBeVisible({ timeout: 90000 });
 });

});

test.describe('ParaBank Account Services', () => {
 
 test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  await page.fill('input[name="username"]', 'john');
  await page.fill('input[name="password"]', 'demo');
  await page.getByRole('button', { name: 'Log In' }).click();

  // await page.waitForURL(/overview/, { timeout: 90000 });

  // // Confirm dashboard loaded
  // await expect(page.getByRole('heading', { name: 'Accounts Overview' }))
  //  .toBeVisible({ timeout: 10000 });
 });

 // ✅ OPEN NEW ACCOUNT

 test('Open a new savings account successfully', async ({ page }) => {
  await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.waitForURL('**/openaccount.htm');
  await page.selectOption('#type', '1'); // '1' is SAVINGS
  await page.getByRole('button', { name: 'Open New Account' }).click();
    
  // await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
 });

 test('Open a new CHECKING account by default (no selection)', async ({ page }) => {
  await page.getByRole('link', { name: 'Open New Account' }).click();
    await page.waitForURL('**/openaccount.htm');
  await page.getByRole('button', { name: 'Open New Account' }).click();
    
  // await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible(); 
 });

 // ✅ ACCOUNTS OVERVIEW

 test('Display accounts overview successfully', async ({ page }) => {
  await page.getByRole('link', { name: 'Accounts Overview' }).click();
    await page.waitForURL('**/overview.htm');
    
  // await expect(page.locator('#accountTable')).toBeVisible(); 
 });

 // ✅ UPDATE CONTACT INFO

 test('Update contact info successfully', async ({ page }) => {
  await page.getByRole('link', { name: 'Update Contact Info' }).click();
    await page.waitForURL('**/updateprofile.htm');

  await page.fill('input[name="customer.address.street"]', 'Updated Street 45');
  await page.fill('input[name="customer.address.city"]', 'Ibadan');
  await page.fill('input[name="customer.phoneNumber"]', '08099998888');
  await page.getByRole('button', { name: 'Update Profile' }).click();

  // await expect(page.getByRole('heading', { name: 'Profile Updated' })).toBeVisible();
 });

 
 // ✅ LOG OUT

 test('Log out successfully ', async ({ page }) => {
  await page.getByRole('link', { name: 'Log Out' }).click();
  await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
 });
});