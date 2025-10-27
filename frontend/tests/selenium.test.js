const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('EcoTrack Frontend Automated Tests', () => {
  let driver;

  // Setup: Start browser before tests
  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in background (no GUI)
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log('✅ Chrome browser started');
  }, 30000);

  // Cleanup: Close browser after tests
  afterAll(async () => {
    if (driver) {
      await driver.quit();
      console.log('✅ Browser closed');
    }
  }, 10000);

  // Test 1: Landing Page Load
  test('Should load landing page successfully', async () => {
    await driver.get('http://localhost:3000');
    
    const title = await driver.getTitle();
    expect(title).toContain('React App'); // Or your actual title
    
    console.log('✅ Landing page loaded');
  }, 20000);

  // Test 2: Navigation to Register Page
  test('Should navigate to register page', async () => {
    await driver.get('http://localhost:3000');
    
    // Find and click Sign Up button
    const signUpButton = await driver.findElement(By.linkText('Sign Up'));
    await signUpButton.click();
    
    // Wait for page to load
    await driver.wait(until.urlContains('/register'), 5000);
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/register');
    
    console.log('✅ Navigated to register page');
  }, 20000);

  // Test 3: Registration Form Validation
  test('Should show validation error for empty form', async () => {
    await driver.get('http://localhost:3000/register');
    
    // Find and click register button without filling form
    const registerButton = await driver.findElement(By.css('button[type="submit"]'));
    await registerButton.click();
    
    // Browser's built-in validation should prevent submission
    const nameInput = await driver.findElement(By.name('name'));
    const isValid = await driver.executeScript('return arguments[0].validity.valid;', nameInput);
    
    expect(isValid).toBe(false);
    
    console.log('✅ Form validation working');
  }, 20000);

  // Test 4: Fill Registration Form
  test('Should fill registration form', async () => {
    await driver.get('http://localhost:3000/register');
    
    const timestamp = Date.now();
    
    // Fill name
    await driver.findElement(By.name('name')).sendKeys('Selenium Test User');
    
    // Fill email
    await driver.findElement(By.name('email')).sendKeys(`selenium${timestamp}@test.com`);
    
    // Fill password
    await driver.findElement(By.name('password')).sendKeys('test1234');
    
    // Fill confirm password
    await driver.findElement(By.name('confirmPassword')).sendKeys('test1234');
    
    console.log('✅ Registration form filled');
    
    // Note: We're not clicking submit to avoid actually registering
    // In real scenario, you'd use a test database
  }, 20000);

  // Test 5: Navigation to Login Page
  test('Should navigate to login page', async () => {
    await driver.get('http://localhost:3000');
    
    const loginButton = await driver.findElement(By.linkText('Login'));
    await loginButton.click();
    
    await driver.wait(until.urlContains('/login'), 5000);
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    console.log('✅ Navigated to login page');
  }, 20000);

  // Test 6: Check Calculator Page (requires login)
  test('Should redirect to login when accessing calculator without auth', async () => {
    await driver.get('http://localhost:3000/calculator');
    
    // Should redirect to login
    await driver.wait(until.urlContains('/login'), 5000);
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    console.log('✅ Protected route working - redirected to login');
  }, 20000);

  // Test 7: Responsive Design Check
  test('Should be responsive on mobile view', async () => {
    // Set mobile viewport
    await driver.manage().window().setRect({
      width: 375,
      height: 667
    });
    
    await driver.get('http://localhost:3000');
    
    // Check if elements are visible
    const navbar = await driver.findElement(By.css('nav'));
    const isDisplayed = await navbar.isDisplayed();
    
    expect(isDisplayed).toBe(true);
    
    // Reset to desktop
    await driver.manage().window().maximize();
    
    console.log('✅ Responsive design working');
  }, 20000);

  // Test 8: Check Page Elements
  test('Should have all landing page elements', async () => {
    await driver.get('http://localhost:3000');
    
    // Check for heading
    const heading = await driver.findElement(By.css('h1'));
    const headingText = await heading.getText();
    expect(headingText.length).toBeGreaterThan(0);
    
    // Check for Sign Up button
    const signUpButton = await driver.findElement(By.linkText('Sign Up'));
    expect(await signUpButton.isDisplayed()).toBe(true);
    
    // Check for Login button
    const loginButton = await driver.findElement(By.linkText('Login'));
    expect(await loginButton.isDisplayed()).toBe(true);
    
    console.log('✅ All landing page elements present');
  }, 20000);
});

// Run tests
console.log('🚀 Starting Selenium Tests...');
console.log('⚠️  Make sure frontend is running on http://localhost:3000');