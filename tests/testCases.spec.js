const { test, expect } = require('@playwright/test');
const {
  navigateToHomePage,
  clickTestCasesLink,
  verifyTestCasesPage,
  closeBrowser,
  waitForPageLoad
} = require('./helpers/navigationHelpers');

/**
 * TEST CASE: Navigate to Test Cases
 * 
 * This test demonstrates how to:
 * 1. Launch Automation Exercise website
 * 2. Click on Test Cases link next to Signup/Login
 * 3. Verify we're on the Test Cases page
 * 
 * REFERENCE TEST FOR FUTURE TESTS:
 * This test uses reusable helper methods from navigationHelpers.js
 * Future tests should follow this pattern and use these helpers for common actions
 * 
 * HOW TO USE IN OTHER TESTS:
 * - Import the helper methods: const { navigateToHomePage, clickTestCasesLink, ... } = require('./helpers/navigationHelpers');
 * - Call the methods in your test: await navigateToHomePage(page);
 * - Add your specific test logic after navigation
 */
test('Navigate to Test Cases page', async ({ page }) => {
  // Set test timeout for slow pages
  test.setTimeout(120000);

  console.log('=== Test Case: Navigate to Test Cases Page ===');

  try {
    // Step 1: Navigate to home page
    await navigateToHomePage(page);
    
    // Step 2: Wait for page to fully load
    await waitForPageLoad(page, 10000);

    // Step 3: Click on Test Cases link
    const testCasesClicked = await clickTestCasesLink(page);
    expect(testCasesClicked).toBe(true);

    // Step 4: Verify we're on Test Cases page
    const isOnTestCasesPage = await verifyTestCasesPage(page);
    expect(isOnTestCasesPage).toBe(true);

    // Step 5: Verify page content - look for test case titles or table
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    
    const pageText = await pageContent.textContent();
    expect(pageText).toBeTruthy();
    
    console.log('✓ Test Cases page content is visible');

    // Step 6: Print test case count if available
    const testCaseItems = page.locator('[class*="test"], tr, li');
    const itemCount = await testCaseItems.count();
    console.log('Number of test case items found on page:', itemCount);

    console.log('✓ Test completed successfully!');
    console.log('=== End of Test ===');

  } catch (err) {
    console.error('✗ Test failed:', err.message);
    throw err;
  } finally {
    // Close browser
    await closeBrowser(page);
  }
});

/**
 * REFERENCE FOR FUTURE TESTS:
 * ============================
 * 
 * Pattern to follow when creating new tests:
 * 
 * const { test, expect } = require('@playwright/test');
 * const {
 *   navigateToHomePage,
 *   clickTestCasesLink,
 *   verifyTestCasesPage,
 *   ... (import other needed helpers)
 * } = require('./helpers/navigationHelpers');
 * 
 * test('Your new test description', async ({ page }) => {
 *   test.setTimeout(120000);
 *   
 *   try {
 *     // Use helper methods for common navigation
 *     await navigateToHomePage(page);
 *     
 *     // Add your specific test logic here
 *     // Example: await clickTestCasesLink(page);
 *     
 *     // Add assertions
 *     // expect(...).toBe(...);
 *     
 *   } finally {
 *     await closeBrowser(page);
 *   }
 * });
 */
