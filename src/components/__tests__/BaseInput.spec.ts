import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
    it('renders properly with default props', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                label: 'Test Label',
                modelValue: 'Initial Value'
            }
        })

        expect(wrapper.exists()).toBe(true)

        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        expect(wrapper.vm.$props.name).toBeDefined()
        expect(wrapper.vm.$props.type).toBe('text')
        expect(wrapper.vm.$props.label).toBe('Test Label')
    })

    it('handles input events', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                label: 'Test Label',
                modelValue: 'test',
                'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e })
            }
        })

        // Find the input element and trigger an input event
        const inputElement = wrapper.find('input[type="text"]')
        await inputElement.setValue('New Value')

        // Assert that the input event handler updates the modelValue
        expect(wrapper.vm.modelValue).toBe('New Value')
    })

    it('displays error message when hasError is true', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                label: 'Test Label',
                modelValue: 'Initial Value',
                hasError: true,
                error: 'Error Message'
            }
        })
        // Assert that the error message is displayed
        //expect(wrapper.find('div > div > div.text-error-500').text()).toBe('Error Message')
        expect(wrapper.find('div > div.text-error-500').exists()).toBe(true)
    })

    it('renders a radio input field when type is "radio"', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                label: 'Option 1',
                modelValue: 1,
                type: 'radio',
                value: 3,
                'onUpdate:modelValue': (e: number) => wrapper.setProps({ modelValue: e })
            }
        })
        await wrapper.find('input').trigger('change')
        const input = wrapper.find('input[type="radio"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('value')).toBe('3')
        expect(wrapper.props('modelValue')).toBe(3)
    })
})
