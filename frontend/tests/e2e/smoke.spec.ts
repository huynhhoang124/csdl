import { test, expect } from '@playwright/test';

test.describe('QLDH smoke', () => {
  test('landing page renders 3 role cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'QLDH' })).toBeVisible();
    await expect(page.getByText('Sinh viên')).toBeVisible();
    await expect(page.getByText('Giảng viên')).toBeVisible();
    await expect(page.getByText('Developer')).toBeVisible();
  });

  test('dev login flow → dashboard', async ({ page }) => {
    await page.goto('/login/dev');
    await page.getByLabel('Email').fill('dev@qldh.local');
    await page.getByLabel('Mật khẩu').fill('dev123');
    await page.getByRole('button', { name: /Đăng nhập/i }).click();

    await expect(page).toHaveURL(/\/dev/);
    await expect(page.getByRole('heading', { name: /Developer Console/i })).toBeVisible();
  });

  test('dev can navigate to TablesPage', async ({ page }) => {
    await page.goto('/login/dev');
    await page.getByLabel('Email').fill('dev@qldh.local');
    await page.getByLabel('Mật khẩu').fill('dev123');
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/\/dev/);

    await page.getByRole('link', { name: /CRUD 26 bảng/i }).click();
    await expect(page).toHaveURL(/\/dev\/tables/);
    await expect(page.getByText(/26 Bảng/i)).toBeVisible();
  });

  test('student login and view grades', async ({ page }) => {
    await page.goto('/login/student');
    await page.getByLabel(/Mã sinh viên/i).fill('SV0001');
    await page.getByLabel('Mật khẩu').fill('student123');
    await page.getByRole('button', { name: /Đăng nhập/i }).click();

    await expect(page).toHaveURL(/\/student/);
    await page.getByRole('link', { name: /Bảng điểm/i }).click();
    await expect(page).toHaveURL(/\/student\/grades/);
    await expect(page.getByRole('heading', { name: /Bảng điểm/i })).toBeVisible();
  });
});
