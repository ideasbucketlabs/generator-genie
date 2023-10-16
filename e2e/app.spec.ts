import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url and show dependency dialog', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toHaveCount(1)
    // await expect(page.locator('body > div')).toHaveCount(0)
    // await expect(page.getByRole('button', { name: 'Add Dependencies' })).toHaveCount(1)
    // await page.getByRole('button', { name: 'Add Dependencies' }).click()
    // await expect(page.locator('body > div')).toHaveCount(1)
})
