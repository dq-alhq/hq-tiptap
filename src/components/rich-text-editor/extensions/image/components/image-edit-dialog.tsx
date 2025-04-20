import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { Button, Form, Popover, Separator, TextField } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconImage, IconImagePlus, IconImageUp } from 'hq-icons'
import React from 'react'

interface ImageEditDialogProps {
    editor: Editor
    state: TiptapState | null
}

const ImageEditDialog = ({ editor, state }: ImageEditDialogProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [link, setLink] = React.useState<string>('')
    const [open, setOpen] = React.useState<boolean>(false)

    const close = React.useCallback(() => {
        setOpen(false)
        setLink('')
    }, [])

    const handleClick = React.useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFile = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files?.length) {
                return
            }

            const insertImages = async () => {
                const contentBucket = []
                const filesArray = Array.from(files)

                for (const file of filesArray) {
                    contentBucket.push({ src: file })
                }

                editor.commands.setImages(contentBucket)
            }

            await insertImages()
            close()
        },
        [editor, close],
    )

    const handleSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            e.stopPropagation()

            if (link) {
                editor.commands.setImages([{ src: link }])
                close()
            }
        },
        [editor, link, close],
    )
    return (
        <Popover isOpen={open} onOpenChange={setOpen}>
            <ToolbarButton
                isSelected={state?.isImage}
                isDisabled={state?.isCodeBlock}
                onPress={() => setOpen(true)}
                tooltip='Image'
            >
                <IconImage />
            </ToolbarButton>
            <Popover.Content className='p-4 min-w-80'>
                <Form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                    <TextField
                        label='Attach an image link'
                        id='image-link'
                        type='url'
                        placeholder='https://example.com'
                        value={link}
                        onChange={(e) => setLink(e)}
                        isRequired
                        suffix={
                            <Button icon type='submit' size='sm' className='mr-1'>
                                <IconImagePlus />
                            </Button>
                        }
                    />
                    <Separator>Or</Separator>
                    <Button type='button' className='w-full' onPress={handleClick}>
                        <IconImageUp /> Upload
                    </Button>
                    <input
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        multiple
                        className='hidden'
                        onChange={handleFile}
                    />
                </Form>
            </Popover.Content>
        </Popover>
    )
}

export { ImageEditDialog }
