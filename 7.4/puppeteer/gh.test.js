const puppeteer = require('puppeteer');

let browser;

// Хук для запуска браузера ДО ВСЕХ тестов
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80, // Замедляем работу браузера для удобства наблюдения
    args: ['--window-size=1280,720'] // Устанавливаем размер окна браузера
  });
}, 10000); // Увеличиваем таймаут запуска браузера до 10 секунд

// Хук для закрытия браузера ПОСЛЕ ВСЕХ тестов
afterAll(async () => {
  await browser.close();
});

// Основной блок тестов
describe("Tests for GitHub pages", () => {
  let page;

  // Хук для создания новой страницы перед КАЖДЫМ тестом
  beforeEach(async () => {
    page = await browser.newPage(); // Создаем новую вкладку
    await page.goto("https://github.com/team", { waitUntil: 'networkidle0' }); // Ждем полной загрузки страницы
  }, 20000); // Таймаут для загрузки страницы увеличивается до 20 секунд

  // Хук для удаления страницы после КАЖДОГО теста
  afterEach(async () => {
    await page.close(); // Закрываем вкладку после окончания теста
  });

  // Блок тестов
  describe("UI elements checks on main GitHub Team page", () => {
    test("Заголовок страницы должен соответствовать ожидаемой строке", async () => {
      await page.waitForSelector("h1", { timeout: 10000 }); // Ожидаем появления <h1> до 10 сек
       const title = await page.title(); // Получаем название страницы
  expect(title).toEqual("GitHub for teams · Build like the best teams on the planet · GitHub"); // Новый заголовок!
}, 10000); // Таймаут теста установлен на 10 секунд
 

    test("Атрибут первой ссылки равен '#start-of-content'", async () => {
      const firstLinkHref = await page.$eval("a", el => el.getAttribute("href")); // Получаем атрибут href первой ссылки
      expect(firstLinkHref).toEqual('#start-of-content'); // Проверяем, что это именно нужный атрибут
    });

    test("Кнопка 'Get started with Team' присутствует и видима", async () => {
      const btnSelector = '.btn-large-mktg.btn-mktg'; // Селектор кнопки
      await page.waitForSelector(btnSelector, { visible: true }); // Ждем пока кнопка станет видимой
      const btnText = await page.$eval(btnSelector, el => el.textContent.trim()); // Получаем текст кнопки
      expect(btnText).toContain("Get started with Team"); // Проверяем текст кнопки
    });
  });

  describe("Navigation between different GitHub sections", () => {
    test("Переход на страницу CI/CD и проверка второго линка", async () => {
      await page.goto("https://github.com/solutions/ci-cd/", { waitUntil: 'networkidle0' }); // Переходим на страницу CI/CD
      const allLinks = await page.$$("a"); // Собираем все ссылки на странице
      expect(allLinks.length).toBeGreaterThanOrEqual(2); // Проверяем, что минимум две ссылки присутствуют
      const secondLink = allLinks[1]; // Берём вторую ссылку
      const secondLinkHref = await page.evaluate(el => el.href, secondLink); // Получаем её атрибут href
      expect(secondLinkHref).toEqual("https://github.com/"); // Проверяем, что вторая ссылка ведёт на главную страницу
    }, 10000); // Таймаут увеличен до 10 секунд

    test("Проверка заголовка страницы спонсоров GitHub", async () => {
      await page.goto("https://github.com/sponsors", { waitUntil: 'networkidle0' }); // Переходим на страницу спонсоров
      await page.waitForSelector("main h1", { timeout: 10000 }); // Ждем появление главного заголовка
      const title = await page.title(); // Получаем заголовок страницы
      expect(title).toEqual("GitHub Sponsors · GitHub"); // Проверяем правильность заголовка
    }, 10000); // Таймаут увеличен до 10 секунд
  });
});