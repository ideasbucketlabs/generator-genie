import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { File } from '@/entity/File'
import TreeNode from '../TreeNode.vue'
import { Language } from '../../entity/Language'
import { type Folder } from '../../entity/ContentTree'
import { ContentType } from '../../entity/ContentType'

describe('TreeNode works for all content type', () => {
    it('binary content cannot be selected', async () => {
        // Define some sample content data for testing
        const content: Array<File | Folder> = [
            {
                type: ContentType.File,
                name: 'File 1',
                id: 'file-1',
                lang: Language.Binary
            } as File
        ]

        const wrapper = mount(TreeNode, {
            props: {
                content,
                level: 1,
                selectedId: null
            }
        })

        // Check if the component renders correctly
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('span.cursor-not-allowed').exists()).toBe(true)
        expect(wrapper.find('span.cursor-pointer').exists()).toBe(false)
    })

    it('renders empty folder properly', async () => {
        // Define some sample content data for testing
        const content: Array<File | Folder> = [
            {
                type: ContentType.Folder,
                name: 'Folder 1',
                id: 'folder-1',
                children: []
            }
        ]

        const wrapper = mount(TreeNode, {
            props: {
                content,
                level: 1,
                selectedId: null
            }
        })

        // Check if the component renders correctly
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('span[title="Empty folder"]').exists()).toBe(true)
    })

    it('can expand and collapse tree properly', async () => {
        // Define some sample content data for testing
        const content: Array<File | Folder> = [
            {
                type: ContentType.File,
                name: 'File 1',
                id: 'file-1',
                lang: Language.Binary
            } as File,
            {
                type: ContentType.Folder,
                name: 'Folder 1',
                id: 'folder-1',
                children: [
                    {
                        type: ContentType.File,
                        name: 'File 2',
                        id: 'file-2',
                        content: '.test{width:2px}',
                        lang: Language.Css
                    } as File
                ]
            }
        ]

        const wrapper = mount(TreeNode, {
            props: {
                content,
                level: 1,
                selectedId: null
            }
        })

        // Count all nodes before expand
        expect(wrapper.findAll('li').length).toBe(3)
        const parentNode = wrapper.find('li.flex-col').find('span.flex')
        await parentNode.trigger('click')
        // Count all nodes after expand
        expect(wrapper.findAll('li').length).toBe(4)
        await parentNode.trigger('click')
        // Count all nodes after collapse
        expect(wrapper.findAll('li').length).toBe(3)
    })
})
