import { test, expect } from '@playwright/test';
import { USER_EMAIL, USER_PASSWORD } from '../user.js';


  test.describe('Авторизация на Netology', () => {
  test('успешная авторизация', async ({ page }) => {
    await page.goto('https://netology.ru/');
    await page.getByRole('link', { name: 'Войти' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.fill('[name="email"]', USER_EMAIL);
    await page.fill('[name="password"]', USER_PASSWORD);
  await page.getByTestId('login-submit-btn').click();
  await page.getByTestId('menu-userface').locator('div').click();
});

  test('Неуспешная авторизация', async ({ page }) => {
     await page.goto('https://netology.ru/');
     await page.getByRole('link', { name: 'Войти' }).click();
     await page.getByRole('textbox', { name: 'Email' }).click();
    await page.fill('[name="email"]', USER_EMAIL);
    await page.getByRole('textbox', { name: 'Пароль' }).fill('Elyasa');
  await page.getByTestId('login-submit-btn').click();
  await expect(page.getByText('Вы ввели неправильно логин или пароль')).toBeVisible();
});
});