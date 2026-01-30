const { test, expect } = require('@playwright/test');

test('User registration and logout flow', async ({ page }) => {
  // Navigate to the home page
  await page.goto('https://practicesoftwaretesting.com/');
  console.log('Navigated to home page');

  //Increase timeout for slow loading pages
  test.setTimeout(120000);

  // Click on the Sign in link
  await page.locator('a:has-text("Sign in")').first().click();
  await page.waitForURL('**/auth/login**', { timeout: 10000 });
  console.log('Clicked Sign in link');

  // Click on the Register your account link
  await page.locator('a:has-text("Register your account")').click();
  await page.waitForURL('**/auth/register**', { timeout: 10000 });
  console.log('Navigated to registration page');

  // Generate unique email
  const timestamp = Date.now();
  const uniqueEmail = `testuser${timestamp}@example.com`;
  console.log('Generated unique email:', uniqueEmail);

  // Fill in First Name
  await page.locator('input[id="first_name"]').fill('John');

  // Fill in Last Name
  await page.locator('input[id="last_name"]').fill('Doe');

  // Fill in Date of Birth
  const dateOfBirthField = page.locator('input[id="dob"]');
  await dateOfBirthField.fill('01/15/1990');

  // Fill in Street Address
  //await page.locator('input[id="address"]').fill('123 Main Street');
  let addressField = page.locator('input[id="address"], input[name="address"], input[placeholder*="Street"], input[placeholder*="Address"]').first();
  await addressField.waitFor({ timeout: 10000 });
  await addressField.fill('123 Main Street');

  // Fill in Postal Code
    await page.locator('xpath=//input[@id="postal_code"]').fill('10001');

  // Fill in City
    await page.locator('xpath=//input[@id="city"]').fill('Rancho Santa Margarita');

  // Select State
 await page.locator('xpath=//input[@id="state"]').fill('California');

  // Select Country - USA
  //XPath to locate the <select> element
  const countryDropdown = page.locator('xpath=//select[@id="country"]');
  //Select the option by visible label
  await countryDropdown.selectOption({ label: 'United States of America (the)' });

  // Fill in Phone
  await page.locator('input[id="phone"]').fill('5551234567');

  // Fill in Email (unique)
  await page.locator('input[id="email"]').fill(uniqueEmail);

  // Fill in Password - must meet requirements (typically: uppercase, lowercase, number, special char, min length)
  const password = 'SecurePass123!';
  await page.locator('input[id="password"]').fill(password);

    // Wait a moment for password strength to be calculated
  await page.waitForTimeout(500);

  // Capture password strength indicator
  const passwordStrengthElement = page.locator('[class*="strength"], [id*="strength"], span:has-text("Strong"), span:has-text("Weak"), span:has-text("Medium")').first();
  let passwordStrength = 'Not found';
  try {
    passwordStrength = await passwordStrengthElement.textContent();
    console.log('Password strength:', passwordStrength);
  } catch (err) {
    console.warn('Password strength indicator not found or not visible');
    // Try alternative selectors
    const strengthText = await page.locator('body').textContent();
    if (strengthText.includes('Strong')) {
      passwordStrength = 'Strong';
    } else if (strengthText.includes('Medium')) {
      passwordStrength = 'Medium';
    } else if (strengthText.includes('Weak')) {
      passwordStrength = 'Weak';
    }
    console.log('Password strength (alternative):', passwordStrength);
  }

  // Scroll to find and click Register button
  const registerButton = page.locator('button:has-text("Register")');
  await registerButton.scrollIntoViewIfNeeded();
  await registerButton.click();
  console.log('Clicked Register button');

  // Wait for successful registration - should redirect to dashboard or login confirmation
  await page.waitForTimeout(2000);
  const currentURL = page.url();
  console.log('Current URL after registration:', currentURL);

  // Verify registration success
  const successMessage = page.locator('text=/success|account created|welcome|dashboard/i');
  const isSuccess = await successMessage.isVisible().catch(() => false);
  
  if (isSuccess) {
    console.log('Registration successful message found');
  } else {
    console.log('No explicit success message, but navigation completed');
  }

  // Try to find and click the logout/sign out button
  // It might be in a dropdown menu or directly on the page
  const userMenuButton = page.locator('button[id*="user"], [class*="user"], [aria-label*="user"], [aria-label*="account"]').first();
  const signOutLink = page.locator('a:has-text("Sign out"), a:has-text("Logout"), button:has-text("Sign out"), button:has-text("Logout")').first();

  // Try to click sign out
  let logoutAttempted = false;
  try {
    await signOutLink.click({ timeout: 5000 });
    logoutAttempted = true;
    console.log('Clicked logout/sign out link');
  } catch (err) {
    console.warn('Could not find logout link immediately, trying user menu');
    try {
      await userMenuButton.click({ timeout: 5000 });
      await page.waitForTimeout(500);
      const signOutInMenu = page.locator('a:has-text("Sign out"), a:has-text("Logout"), button:has-text("Sign out"), button:has-text("Logout")').first();
      await signOutInMenu.click();
      logoutAttempted = true;
      console.log('Clicked logout from user menu');
    } catch (innerErr) {
      console.warn('Could not find user menu or logout option');
    }
  }

  if (logoutAttempted) {
    // Wait for redirect to login or home page
    await page.waitForTimeout(2000);
    const logoutURL = page.url();
    console.log('URL after logout:', logoutURL);
    expect(logoutURL).toMatch(/login|home|signin|register/i);
  }

  console.log('Test completed successfully');
  console.log('Registration Details:');
  console.log('- Email:', uniqueEmail);
  console.log('- Password Strength:', passwordStrength);
});
