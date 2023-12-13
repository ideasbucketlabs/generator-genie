import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SpringProject from '../SpringProject.vue'
import type { SpringProject as SpringProjectType } from '@/entity/SpringProject'
import { Language } from '../../entity/Language'
import { SpringBootVersion } from '../../entity/SpringBootVersion'

describe('SpringProject works correctly', () => {
    it('renders language radio buttons', () => {
        const wrapper = mount(SpringProject, {
            props: {
                modelValue: {
                    active: false,
                    valid: false,
                    metaData: {
                        language: Language.Java,
                        springBootVersion: SpringBootVersion['3_1_6'] as SpringBootVersion,
                        group: 'test',
                        name: 'demo',
                        artifact: 'demo',
                        packageName: 'demo',
                        description: 'This application needs some description to be filled out.',
                        javaVersion: 17
                    }
                }
            }
        })
        expect(wrapper.find('[name="languagePreference"]').exists()).toBe(true)
    })

    it('updates language on radio button click', async () => {
        const wrapper = mount(SpringProject, {
            props: {
                modelValue: {
                    active: false,
                    valid: false,
                    metaData: {
                        language: Language.Java,
                        springBootVersion: SpringBootVersion['3_1_6'] as SpringBootVersion,
                        group: 'test',
                        name: 'demo',
                        artifact: 'demo',
                        packageName: 'demo',
                        description: 'This application needs some description to be filled out.',
                        javaVersion: 17
                    }
                },
                'onUpdate:modelValue': (e: { active: boolean; valid: boolean; metaData: SpringProjectType }) =>
                    wrapper.setProps({ modelValue: e })
            }
        })

        // Simulate a click event on a radio button
        const inputElement = wrapper.find('input[name="languagePreference"][value="kotlin"]')
        expect(inputElement.exists()).toBe(true)
        await wrapper.find('input[name="languagePreference"][value="kotlin"]').trigger('change')

        // Check if the component's data (language) was updated
        expect(wrapper.vm.modelValue.metaData.language).toBe(Language.Kotlin)
    })
})
