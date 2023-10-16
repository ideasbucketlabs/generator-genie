import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppComponentLoader from '../AppComponentLoader.vue'

describe('AppComponentLoader', () => {
    it('renders the component', () => {
        const wrapper = mount(AppComponentLoader)

        // Check if the component exists
        expect(wrapper.exists()).toBe(true)
    })

    it('displays loading text', () => {
        const loadingText = 'Testing...'
        const wrapper = mount(AppComponentLoader, {
            slots: {
                default: loadingText
            },
            global: {
                stubs: {
                    teleport: true
                }
            }
        })
        // Check if the loading text is displayed
        expect(wrapper.text()).toContain(loadingText)
    })

    // Add more test cases for other basic component functionality if needed
})
