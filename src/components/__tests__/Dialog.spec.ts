import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from '../Dialog.vue'

describe('Dialog works correctly', () => {
    it('displays content when "displayContent" is true', async () => {
        const wrapper = mount(Dialog)
        await wrapper.vm.$nextTick()
        expect((wrapper.vm as any).displayOverlay).toBe(true)
    })

    it('hides content when "displayContent" is false', async () => {
        const wrapper = mount(Dialog)
        await wrapper.vm.$nextTick()

        expect((wrapper.vm as any).displayOverlay).toBe(true)
        wrapper.vm.hide()
        await wrapper.vm.$nextTick()
        expect((wrapper.vm as any).displayContent).toBe(false)
    })

    it('emits "close" event when closing', async () => {
        const wrapper = mount(Dialog)
        // Initially, content should be hidden
        expect((wrapper.vm as any).displayOverlay).toBe(false)
        await wrapper.vm.$nextTick()
        // Show the content
        await (wrapper.vm as any).show()

        // Close the component
        await (wrapper.vm as any).onClose()

        // Check if the "close" event was emitted
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})
