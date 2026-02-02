const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const {
  navigateToHomePage,
  closeBrowser,
  waitForPageLoad
} = require('./helpers/navigationHelpers');

/**
 * TEST CASE 4: Logout User
 * Follows automationexercise.com Test Case 4: Logout User
 * 
 * This test verifies the complete logout functionality
 * Reads credentials from Login Test-data.json file
 * 
 * All 10 Steps:
 * 1. Launch browser and navigate to automationexercise.com
 * 2. Navigate to Test Cases page
 * 3. Click on Test Case 4: Logout User link
 * 4. Click Signup/Login link
 * 5. Enter email address (from Login Test-data.json)
 * 6. Enter password (from Login Test-data.json)
 * 7. Click Login button
 * 8. Verify user is logged in
 * 9. Click Logout button
 * 10. Verify user is logged out and on login page
 */

test('Test Case 4: Logout User - Complete Workflow', async ({ page }) => {
  test.setTimeout(120000);

  console.log('\n========================================');
  console.log('TEST CASE 4: LOGOUT USER');
  console.log('========================================\n');

  // Read login credentials from JSON file
  const testDataPath = path.join(__dirname, '../test-data/Login Test-data.json');
  let email, password, fullName;

  try {
    const loginData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
    email = loginData['Email address'];
    password = loginData['Password'];
    fullName = loginData['Full Name'] || `${loginData['First Name']} ${loginData['Last Name']}`;

    console.log('--- Credentials from Login Test-data.json ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Full Name:', fullName);
    console.log('-------------------------------------------\n');
  } catch (err) {
    console.error('Failed to read Login Test-data.json:', err.message);
    throw err;
  }

  try {
    // STEP 1: Launch browser and navigate to automationexercise.com
    console.log('Step 1: Launch browser and navigate to automationexercise.com');
    await navigateToHomePage(page);
    await waitForPageLoad(page, 10000);
    console.log('✓ Home page loaded successfully\n');

    // STEP 2: Navigate to Test Cases page
    console.log('Step 2: Navigate to Test Cases page');
    await page.goto('https://automationexercise.com/test_cases', { waitUntil: 'load' });
    console.log('✓ Test Cases page loaded\n');

    // STEP 3: Click on Test Case 4: Logout User link
    console.log('Step 3: Click on Test Case 4: Logout User link');
    const testCase4Link = page.locator('a:has-text("Logout User")').first();
    
    try {
      await testCase4Link.waitFor({ timeout: 5000 });
      await testCase4Link.click();
      console.log('✓ Clicked Test Case 4: Logout User link\n');
      await page.waitForTimeout(1000);
    } catch (err) {
      console.log('⚠ Test Case 4 link not found on page, continuing to login page...\n');
    }

    // STEP 4: Click Signup/Login link
    console.log('Step 4: Click Signup/Login link');
    const signupLoginLink = page.locator('a:has-text("Signup / Login")').first();
    await signupLoginLink.waitFor({ timeout: 5000 });
    await signupLoginLink.click();
    console.log('✓ Clicked Signup/Login link');
    await page.waitForURL('**/login**', { timeout: 10000 });
    console.log('✓ On Login page\n');

    // STEP 5: Enter email address from Login Test-data.json
    console.log('Step 5: Enter email address from Login Test-data.json');
    const emailField = page.locator('input[data-qa="login-email"]');
    await emailField.waitFor({ timeout: 5000 });
    await emailField.fill(email);
    console.log('✓ Filled email:', email);

    // Alternative approach: directly navigate to login if helper fails
    if (!(await page.url().includes('login'))) {
      console.log('⚠ Not on login page, navigating directly...');
      await page.goto('https://automationexercise.com/login', { waitUntil: 'load' });
      const altEmailField = page.locator('input[data-qa="login-email"]');
      await altEmailField.fill(email);
      console.log('✓ Filled email (via direct navigation):', email);
    }

    // STEP 6: Enter password from Login Test-data.json
    console.log('Step 6: Enter password from Login Test-data.json');
    const passwordField = page.locator('input[data-qa="login-password"]');
    await passwordField.fill(password);
    console.log('✓ Filled password\n');

    // STEP 7: Click Login button
    console.log('Step 7: Click Login button');
    const loginButton = page.locator('button[data-qa="login-button"]');
    await loginButton.click();
    console.log('✓ Clicked Login button');
    await page.waitForTimeout(2000);
    console.log('✓ Login process completed\n');

    // STEP 8: Verify user is logged in
    console.log('Step 8: Verify user is logged in');
    
    let isLoggedIn = false;
    const logoutLink = page.locator('a:has-text("Logout")');
    const loggedInText = page.locator('text=Logged in as');

    try {
      await expect(logoutLink).toBeVisible({ timeout: 5000 });
      console.log('✓ Logout link found - User IS logged in');
      isLoggedIn = true;
    } catch (err) {
      console.log('⚠ Logout link not visible, checking for logged-in indicator...');
      
      try {
        await expect(loggedInText).toBeVisible({ timeout: 3000 });
        console.log('✓ "Logged in as" text found - User IS logged in');
        isLoggedIn = true;
      } catch (err2) {
        console.log('⚠ Login verification inconclusive');
      }
    }

    if (!isLoggedIn) {
      const bodyText = await page.textContent('body');
      if (bodyText.includes('Logout') || bodyText.includes('Logged in')) {
        console.log('✓ User appears to be logged in (via page content)');
        isLoggedIn = true;
      }
    }

    if (!isLoggedIn) {
      throw new Error('User login could not be verified');
    }

    console.log('✓ User login verified successfully\n');

    // STEP 9: Click Logout button
    console.log('Step 9: Click Logout button');
    
    const logoutBtn = page.locator('a:has-text("Logout")').first();
    
    try {
      await logoutBtn.waitFor({ timeout: 5000 });
      await logoutBtn.click();
      console.log('✓ Clicked Logout button');
      await page.waitForTimeout(2000);
      console.log('✓ Logout process completed\n');
    } catch (err) {
      console.error('✗ Failed to click logout button:', err.message);
      throw new Error('Could not find or click Logout button');
    }

    // STEP 10: Verify user is logged out and on login page
    console.log('Step 10: Verify user is logged out and on login page');
    
    let logoutSuccessful = false;
    
    // Check if we're on login page
    const currentURL = page.url();
    console.log('Current URL after logout:', currentURL);

    // Check that logout link is no longer visible
    const logoutLinkStillVisible = await logoutLink.isVisible().catch(() => false);
    
    if (!logoutLinkStillVisible) {
      console.log('✓ Logout link no longer visible - User is logged out');
      logoutSuccessful = true;
    }

    // Check for login form presence
    const loginForm = page.locator('form:has(input[data-qa="login-email"])');
    try {
      await expect(loginForm).toBeVisible({ timeout: 3000 });
      console.log('✓ Login form is visible - User is on login page');
      logoutSuccessful = true;
    } catch (err) {
      console.log('⚠ Login form not immediately visible');
    }

    // Check for Signup/Login link
    const signupLoginLinkAfter = page.locator('a:has-text("Signup / Login")');
    try {
      await expect(signupLoginLinkAfter).toBeVisible({ timeout: 3000 });
      console.log('✓ Signup/Login link visible - User is logged out');
      logoutSuccessful = true;
    } catch (err) {
      console.log('⚠ Signup/Login link not found');
    }

    // Check page content
    const bodyContent = await page.textContent('body');
    if (bodyContent.includes('Login') && !bodyContent.includes('Logout')) {
      console.log('✓ Page content confirms logout (no Logout button, Login present)');
      logoutSuccessful = true;
    }

    if (logoutSuccessful) {
      console.log('\n✅ TEST CASE 4 PASSED');
      console.log('========================================');
      console.log('User successfully logged out!');
      console.log('User was on login/home page after logout');
      console.log('========================================\n');
    } else {
      throw new Error('Could not verify successful logout');
    }

  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    console.error('========================================\n');
    throw err;
  } finally {
    await closeBrowser(page);
  }
});
