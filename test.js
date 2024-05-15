const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/'); // Update URL with your application's URL

  await page.waitForSelector('#users');

  await page.click('#users tbody tr:first-child button');

  await page.waitForSelector('.info');

  const identificationNumber = await page.textContent('.info > p:nth-child(1)');
  const birthDate = await page.textContent('.info > p:nth-child(2)');
  const gender = await page.textContent('.info > p:nth-child(3)');

  console.log('Identification Number:', identificationNumber);
  console.log('Birth Date:', birthDate);
  console.log('Gender:', gender);

  await browser.close();
})();
