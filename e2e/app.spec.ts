import os from 'os'
import { test, expect } from '@playwright/test'
import * as timers from 'timers'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url and show dependency dialog', async ({ page }) => {
    const metaKey = os.platform() === 'darwin' ? 'Meta' : 'Control'
    // expect(getUA).toBe('taco')
    // console.log(isMac)
    await page.goto('/')
    await expect(page.locator('body')).toHaveCount(1)

    // Initially there should not be any selected package item
    await expect(page.locator('div[data-selected-package-item="true"]')).toHaveCount(0)

    // Make sure dependencies button is shown and clickable
    await expect(page.getByRole('button', { name: 'Add Dependencies' })).toHaveCount(1)
    await page.getByRole('button', { name: 'Add Dependencies' }).click({ force: true })

    // Make sure that items are displayed
    await expect(page.locator('div[role="dialog"]')).toHaveCount(1)
    await expect(page.locator('div[data-package-item="true"]')).toHaveCount(96)
    await expect(page.locator('div[data-package-item-id="lombok"]')).toHaveCount(1)

    // Make sure package filter works
    await page.locator('input[name="dependencies-input-filter"]').fill('web')
    await expect(page.locator('div[data-package-item="true"]')).toHaveCount(4)
    await expect(page.locator('div[data-package-item-id="lombok"]')).toHaveCount(0)
    await page.locator('div[data-package-item-id="web"]').click()

    // Make sure that package selection works
    await expect(page.locator('div[data-selected-package-item="true"]')).toHaveCount(1)
    await expect(page.locator('div[data-selected-package-item-id="web"]')).toHaveCount(1)

    // Make sure that remove package button works
    await expect(page.locator('button[title="Remove this package"]')).toHaveCount(1)
    await page.locator('button[title="Remove this package"]').click()
    await expect(page.locator('div[data-selected-package-item="true"]')).toHaveCount(0)

    // Make sure that multiple works
    await expect(page.getByRole('button', { name: 'Add Dependencies' })).toHaveCount(1)
    await page.getByRole('button', { name: 'Add Dependencies' }).click({ force: true })

    timers.setTimeout(async () => {
        await expect(page.locator('div[data-package-item-id="web"]')).toHaveCount(1)
        await page.locator('div[data-package-item-id="web"]').click({ modifiers: [metaKey] })
        //await page.keyboard.press(`${metaKey}+Enter`)

        await page.locator('div[data-package-item-id="lombok"]').click({ modifiers: [metaKey] })
        //await page.keyboard.press(`${metaKey}+Enter`)

        await page.locator('input[name="dependencies-input-filter"]').press('Escape')

        // Make sure Dependencies dialog is closed and appropriate packages are shown
        //await expect(page.locator('div[role="dialog"]')).toHaveCount(0)
        await expect(page.locator('div[data-selected-package-item="true"]')).toHaveCount(2)
    }, 2000)
})
