import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NestedOption from '../NestedOption.vue'
import { ContentType } from '@/entity/ContentType'
import { Language } from '@/entity/Language'
import { type Folder } from '@/entity/ContentTree'
import { type File } from '@/entity/File'

describe('NestedOption works correctly', () => {
    it('renders options based on content', () => {
        // Define some sample content data for testing
        const content: Array<Folder | File> = [
            {
                type: ContentType.Folder,
                name: 'Folder 1',
                id: 'folder-1',
                children: [
                    {
                        type: ContentType.File,
                        name: 'File 1',
                        id: 'file-1',
                        lang: Language.Text,
                        content: 'File 1 content'
                    },
                    {
                        type: ContentType.Folder,
                        name: 'Folder 2',
                        id: 'folder-2',
                        children: [
                            {
                                type: ContentType.File,
                                name: 'File 2',
                                id: 'file-2',
                                lang: Language.Text,
                                content: 'File 2 content'
                            }
                        ]
                    }
                ]
            },
            {
                type: ContentType.File,
                name: 'File 3',
                id: 'file-3',
                lang: Language.Text,
                content: 'File 3 content'
            }
        ]

        const selectedId = 'file-1'

        const wrapper = mount(NestedOption, {
            props: {
                content,
                selectedId
            }
        })

        // Check if options are rendered based on content and selectedId
        const options = wrapper.findAll('option')
        expect(options).toHaveLength(5) // 2 folders, 3 files
        expect(options[0].text()).toContain('Folder 1')
        expect(options[1].text()).toContain('File 1')
        expect(options[2].text()).toContain('Folder 2')
        expect(options[3].text()).toContain('File 2')
        expect(options[4].text()).toContain('File 3')

        // Check if the selected option is set properly
        expect(options[1].element.selected).toBe(true)
    })

    it('calculates path separator based on the level', () => {
        // Define a specific level for testing
        const level = 3

        const wrapper = mount(NestedOption, {
            props: {
                content: [],
                level
            }
        })

        // Check if the path separator is calculated correctly
        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        const pathSeparator = (wrapper.vm as any).pathSeperator
        expect(pathSeparator).toBe('../../')
    })
})
