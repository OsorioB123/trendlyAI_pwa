import { test, expect } from '@playwright/test'

const withBaseURL = (path: string) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
  return new URL(path, baseURL).toString()
}

test.beforeEach(async ({ page }) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost'
  await page.context().addCookies([
    {
      name: '__e2e_test__',
      value: 'true',
      domain: new URL(baseURL).hostname,
      path: '/',
    },
  ])
  await page.addInitScript(() => {
    ;(window as any).__E2E_TEST__ = true
  })
})

test.describe('Header system', () => {
  test('dashboard uses primary header and actions work', async ({ page }) => {
    await page.goto(withBaseURL('/dashboard'))

    await expect(page.getByTestId('primary-header')).toBeVisible()

    await page.getByTestId('upgrade-button').click()
    await expect(page.getByText('Eleve seu estúdio com o Maestro')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByText('Eleve seu estúdio com o Maestro')).toBeHidden()

    await page.getByTestId('notifications-button').click()
    await expect(page.getByText('Notificações')).toBeVisible()

    await page.getByTestId('profile-button').click()
    await expect(page.getByText('Meu Perfil')).toBeVisible()
  })

  test('secondary header appears on internal pages and back button navigates home', async ({ page }) => {
    await page.goto(withBaseURL('/tools'))

    await expect(page.getByTestId('secondary-header')).toBeVisible()
    await page.getByTestId('back-button').click()
    await expect(page).toHaveURL(/dashboard/)
  })

  test('chat page renders dedicated header on mobile and desktop', async ({ page, browserName }) => {
    await page.goto(withBaseURL('/chat'))
    await expect(page.getByTestId('chat-header')).toBeVisible()

    // Desktop should not have primary header upgrade CTA
    await expect(page.getByTestId('primary-header')).toHaveCount(0)

    if (browserName !== 'webkit') {
      await page.setViewportSize({ width: 414, height: 896 })
      await expect(page.getByTestId('chat-menu-button')).toBeVisible()
    }
  })
})
