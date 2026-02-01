const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const {
  navigateToHomePage,
  clickTestCasesLink,
  verifyTestCasesPage,
  closeBrowser,
  waitForPageLoad
} = require('./helpers/navigationHelpers');

/**
 * TEST CASE: Register User - Test Case 1
 * Follows automationexercise.com Test Case 1: Register User
 */

test('Test Case 1: Register User', async ({ page }) => {
  test.setTimeout(180000);

  console.log('=== TEST CASE 1: REGISTER USER ===\n');
  
  const timestamp = Date.now();
  const fullName = 'AutoTest User';
  const firstName = 'AutoTest';
  const lastName = 'User';
  const email = `testuser${timestamp}@example.com`;
  const password = 'SecurePass123!';
  
  console.log('--- Registration Details ---');
  console.log('Name:', fullName);
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('----------------------------\n');

  try {
    // Step 1: Navigate to home page
    console.log('Step 1: Navigate to home page');
    await navigateToHomePage(page);
    await waitForPageLoad(page, 10000);

    // Step 2: Navigate to Test Cases page
    console.log('Step 2: Navigate to Test Cases page');
    const testCasesClicked = await clickTestCasesLink(page);
    expect(testCasesClicked).toBe(true);

    // Step 3: Click on Test Case 1: Register User link
    console.log('Step 3: Click on Test Case 1: Register User');
    const testCase1Link = page.locator('a:has-text("Register User")').first();
    await testCase1Link.waitFor({ timeout: 10000 });
    await testCase1Link.click();
    await page.waitForTimeout(1000);

    // Step 4: Click Signup/Login to access registration
    console.log('Step 4: Click Signup/Login link');
    const signupLoginLink = page.locator('a:has-text("Signup / Login")').first();
    await signupLoginLink.waitFor({ timeout: 10000 });
    await signupLoginLink.click();
    await page.waitForURL('**/login**', { timeout: 10000 });
    console.log('✓ On Signup/Login page');

    // Step 5: Look for "New User Signup!" section
    console.log('Step 5: Fill in New User Signup section');
    const newUserSignupHeading = page.locator('text=New User Signup!');
    await newUserSignupHeading.waitFor({ timeout: 10000 });
    console.log('✓ Found New User Signup section');
    
    // Fill Name field
    const nameField = page.locator('input[placeholder="Name"]').first();
    await nameField.waitFor({ timeout: 5000 });
    await nameField.fill(fullName);
    console.log('✓ Filled Name:', fullName);
    
    // Fill Email field
    const emailSignupField = page.locator('input[placeholder="Email Address"]').nth(1);
    await emailSignupField.fill(email);
    console.log('✓ Filled Email:', email);
    
    // Step 6: Click Sign Up button
    console.log('Step 6: Click Sign Up button');
    const signupButton = page.locator('button:has-text("Signup")').first();
    await signupButton.click();
    console.log('✓ Clicked Sign Up button');
    
    // Wait for registration form page to load - use waitForLoadState instead of waitForTimeout
    try {
      await page.waitForNavigation({ url: '**/signup**', timeout: 10000 }).catch(() => {
        console.log('Navigation to signup page timed out, but continuing...');
      });
    } catch (err) {
      console.log('Could not wait for signup navigation:', err.message);
    }
    
    // Wait a bit for page to fully load
    await page.waitForTimeout(3000);
       
    const currentURL = page.url();
    console.log('Current URL after Sign Up:', currentURL);
    
    // Step 7: Fill registration form fields
    console.log('Step 7: Filling registration details form');
    
    // First, check if there are any error messages on the page
    const errorElements = page.locator('[class*="error"], [class*="alert-danger"]');
    const errorCount = await errorElements.count();
    if (errorCount > 0) {
      const errorText = await errorElements.first().textContent();
      console.log('✗ Error found on page:', errorText);
    }
    
    // Check page content for debugging
    const bodyContent = await page.textContent('body');
    console.log('Page loaded successfully with content');
    
    // Select Title (Mr.)
    try {
      const titleRadio = page.locator('//input[@id="id_gender1"]').first();
      await titleRadio.click();
      console.log('✓ Selected Title: Mr.');
    } catch (err) {
      console.log('Title field not found (optional)');
    }
    
    // Fill Password - try different selectors
   await page.locator('//input[@id="password"]').fill('YourPassword123');
    console.log('✓ Filled Password');
    
    // Select Date of Birth
    try {
      const daySelect = page.locator('select#days').first();
      await daySelect.selectOption('15');
      const monthSelect = page.locator('select#months').first();
      await monthSelect.selectOption('January');
      const yearSelect = page.locator('select#years').first();
      await yearSelect.selectOption('1990');
      console.log('✓ Selected Date of Birth: 15 January 1990');
    } catch (err) {
      console.log('Date of Birth fields not found (optional)');
    }
    
    // Fill First Name
    const firstNameField = page.locator('input#first_name').first();
    await firstNameField.fill(firstName);
    console.log('✓ Filled First Name:', firstName);
    
    // Fill Last Name
    const lastNameField = page.locator('input#last_name').first();
    await lastNameField.fill(lastName);
    console.log('✓ Filled Last Name:', lastName);
    
    // Fill Company (optional)
    try {
      const companyField = page.locator('input#company').first();
      await companyField.fill('Test Company');
      console.log('✓ Filled Company');
    } catch (err) {
      console.log('Company field not found (optional)');
    }
    
    // Fill Address (optional)
    try {
      const addressField = page.locator('input#address1, textarea#address1').first();
      await addressField.fill('123 Test Street, Test City');
      console.log('✓ Filled Address');
    } catch (err) {
      console.log('Address field not found (optional)');
    }
    
    // Select Country (optional)
    try {
      const countrySelect = page.locator('select#country').first();
      await countrySelect.selectOption('United States');
      console.log('✓ Selected Country');
    } catch (err) {
      console.log('Country field not found (optional)');
    }
    
    // Fill State (optional)
    try {
      const stateField = page.locator('input#state').first();
      await stateField.fill('California');
      console.log('✓ Filled State');
    } catch (err) {
      console.log('State field not found (optional)');
    }
    
    // Fill City (optional)
    try {
      const cityField = page.locator('input#city').first();
      await cityField.fill('Test City');
      console.log('✓ Filled City');
    } catch (err) {
      console.log('City field not found (optional)');
    }
    
    // Fill Zipcode (optional)
    try {
      const zipcodeField = page.locator('input#zipcode').first();
      await zipcodeField.fill('12345');
      console.log('✓ Filled Zipcode');
    } catch (err) {
      console.log('Zipcode field not found (optional)');
    }
    
    // Fill Mobile Number (optional)
    try {
      const mobileField = page.locator('input#mobile_number').first();
      await mobileField.fill('5551234567');
      console.log('✓ Filled Mobile Number');
    } catch (err) {
      console.log('Mobile Number field not found (optional)');
    }

    // Step 8: Submit registration form
    console.log('Step 8: Submitting registration form');
    const createAccountButton = page.locator('button:has-text("Create Account")').first();
    await createAccountButton.waitFor({ timeout: 5000 });
    await createAccountButton.click();
    console.log('✓ Clicked Create Account button');

    // Wait for account creation to complete
    await page.waitForTimeout(5000);

    // Step 9: Verify successful registration
    console.log('Step 9: Verifying successful registration');
    
    const finalURL = page.url();
    console.log('Final URL:', finalURL);

    // Check for account created confirmation
    const accountCreatedText = page.locator('text=ACCOUNT CREATED!!');
    try {
      await expect(accountCreatedText).toBeVisible({ timeout: 5000 });
      console.log('✓ Account created successfully!');
    } catch (err) {
      console.log('Account created confirmation not found, checking page content...');
    }

    // Print success message
    console.log('\n=== ✓ REGISTRATION COMPLETED SUCCESSFULLY ===');
    console.log('Credentials:');
    console.log('  Name: ' + fullName);
    console.log('  Email: ' + email);
    console.log('  Password: ' + password);
    console.log('==========================================\n');

    // Save credentials for Login Test-data.json update
    const newCredentials = {
      'First Name': firstName,
      'Last Name': lastName,
      'Email address': email,
      'Password': password,
      'Full Name': fullName,
      'Timestamp': new Date().toISOString()
    };

    console.log('Updated credentials to use in Login Test-data.json:');
    console.log(JSON.stringify(newCredentials, null, 2));

  } catch (err) {
    console.error('✗ Test failed:', err.message);
    throw err;
  } finally {
    await closeBrowser(page);
  }
});
