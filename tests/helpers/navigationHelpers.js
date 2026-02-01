/**
 * Navigation Helper Functions - Reusable across all tests
 */

async function navigateToHomePage(page) {
  await page.goto('https://automationexercise.com/');
  console.log('Navigated to Automation Exercise home page');
}

async function clickTestCasesLink(page) {
  try {
    const testCasesLink = page.locator('a:has-text("Test Cases")').first();
    await testCasesLink.waitFor({ timeout: 10000 });
    await testCasesLink.click();
    console.log('Clicked Test Cases link');
    await page.waitForURL('**/test_cases**', { timeout: 10000 });
    console.log('Successfully navigated to Test Cases page');
    return true;
  } catch (err) {
    console.error('Failed to click Test Cases link:', err.message);
    return false;
  }
}

async function verifyTestCasesPage(page) {
  try {
    const currentURL = page.url();
    console.log('Current URL:', currentURL);
    if (currentURL.includes('test_cases')) {
      console.log('✓ Confirmed: We are on the Test Cases page');
      return true;
    } else {
      console.log('✗ Warning: URL does not contain "test_cases"');
      return false;
    }
  } catch (err) {
    console.error('Error verifying Test Cases page:', err.message);
    return false;
  }
}

async function clickSignupLoginLink(page) {
  try {
    const signupLink = page.locator('a:has-text("Signup / Login")').first();
    await signupLink.waitFor({ timeout: 10000 });
    await signupLink.click();
    console.log('Clicked Signup/Login link');
    await page.waitForURL('**/login**', { timeout: 10000 });
    console.log('Successfully navigated to Signup/Login page');
    return true;
  } catch (err) {
    console.error('Failed to click Signup/Login link:', err.message);
    return false;
  }
}

async function closeBrowser(page) {
  try {
    if (page && !page.isClosed()) {
      await page.close();
      console.log('Browser closed successfully');
    }
  } catch (err) {
    console.error('Error closing browser:', err.message);
  }
}

async function waitForPageLoad(page, timeout = 5000) {
  try {
    await page.waitForLoadState('networkidle', { timeout });
    console.log('Page loaded successfully');
    return true;
  } catch (err) {
    console.warn('Page load timeout or network still active:', err.message);
    return false;
  }
}

module.exports = {
  navigateToHomePage,
  clickTestCasesLink,
  verifyTestCasesPage,
  clickSignupLoginLink,
  closeBrowser,
  waitForPageLoad
};
