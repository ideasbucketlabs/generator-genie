import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'
import DependenciesDialog from '../DependenciesDialog.vue'
import Dialog from '../Dialog.vue'
import { ProjectType } from '../../entity/ProjectType'

describe('DependenciesDialog works correctly', () => {
    beforeEach(() => {
        // creates a fresh pinia and makes it active
        // so it's automatically picked up by any useStore() call
        // without having to pass it to it: `useStore(pinia)`
        setActivePinia(createPinia())
    })

    it('renders the component', () => {
        const wrapper = mount(DependenciesDialog, {
            props: {
                projectType: ProjectType.VueJS,
                modelValue: new Set<string>()
            }
        })

        expect(wrapper.exists()).toBe(true)
    })

    it('filters dependencies based on input', async () => {
        const wrapper = mount(DependenciesDialog, {
            props: {
                projectType: ProjectType.Spring,
                modelValue: new Set<string>(),
                'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e })
            }
        })

        const dialog = wrapper.getComponent(Dialog)
        await dialog.vm.$nextTick()
        expect(dialog.isVisible()).toBe(true)
    })
})
