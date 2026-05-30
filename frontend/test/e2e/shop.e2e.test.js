import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { expect } from "chai";
import "chromedriver";

const URL = "http://localhost:5173";

describe("Tienda Online - E2E", function () {
  let driver;
  this.timeout(20000);

 before(async () => {
  const options = new chrome.Options();
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
});

  after(async () => {
    if (driver) await driver.quit();
  });

  // ✅ TEST 1: Login exitoso
  it("Debe iniciar sesión correctamente con admin", async () => {
    await driver.get(`${URL}/login`);

    await driver.findElement(By.css("input[type='text']"))
      .sendKeys("admin");

    await driver.findElement(By.css("input[type='password']"))
      .sendKeys("admin123");

    await driver.findElement(By.css("button[type='submit']"))
      .click();

    await driver.wait(until.urlIs(`${URL}/`), 5000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal(`${URL}/`);
  });

  // ❌ TEST 2: Login fallido
 it("Debe mostrar error con credenciales incorrectas", async () => {
  await driver.get(`${URL}/login`);
  await driver.executeScript("localStorage.clear()");
  await driver.get(`${URL}/login`);

  await driver.wait(
    until.elementLocated(By.css("input[type='text']")), 5000
  );

  await driver.findElement(By.css("input[type='text']"))
    .sendKeys("usuariofalso");
  await driver.findElement(By.css("input[type='password']"))
    .sendKeys("clavefalsa");
  await driver.findElement(By.css("button[type='submit']"))
    .click();

  const error = await driver.wait(
    until.elementLocated(By.css(".error-msg")), 5000
  );

  const text = await error.getText();
  expect(text).to.not.be.empty;
});


  // 🛒 TEST 3: Ver productos en Home
it("Debe mostrar productos en el catálogo", async () => {
  await driver.get(`${URL}/login`);
  await driver.executeScript("localStorage.clear()");
  await driver.get(`${URL}/login`);

  await driver.wait(
    until.elementLocated(By.css("input[type='text']")), 5000
  );

  await driver.findElement(By.css("input[type='text']"))
    .sendKeys("admin");
  await driver.findElement(By.css("input[type='password']"))
    .sendKeys("admin123");
  await driver.findElement(By.css("button[type='submit']"))
    .click();

  await driver.wait(until.urlIs(`${URL}/`), 5000);

  await driver.wait(
    until.elementLocated(By.css(".card")), 5000
  );

  const cards = await driver.findElements(By.css(".card"));
  expect(cards.length).to.be.greaterThan(0);
});
  // 🛍️ TEST 4: Click en botón Comprar
  it("Debe poder hacer click en el botón Comprar", async () => {
    await driver.get(`${URL}/`);

    const buyButton = await driver.wait(
      until.elementLocated(By.css(".btn")),
      5000
    );

    await buyButton.click();
    // Verifica que no hubo crash — la página sigue cargada
    const url = await driver.getCurrentUrl();
    expect(url).to.include("localhost");
  });

});