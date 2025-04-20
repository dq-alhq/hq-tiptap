import { colors } from '@/components/rich-text-editor/extensions/color/colors'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { ColorField, ColorSwatchPicker, Popover, isBrightColor } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconBaseline } from 'hq-icons'
import React from 'react'
import { Button, type Color } from 'react-aria-components'

export const TextColor = ({ editor, state }: { editor: Editor; state: TiptapState | null }) => {
    const color = state?.textColor || '#000'
    const [selectedColor, setSelectedColor] = React.useState(color)

    const handleColorChange = React.useCallback(
        (value: Color) => {
            setSelectedColor(value.toString('hex'))
            editor.chain().setColor(value.toString('hex')).run()
        },
        [editor],
    )

    React.useEffect(() => {
        setSelectedColor(color)
    }, [color])

    return (
        <Popover>
            <Button
                className='rounded-lg border cursor-pointer hover:bg-muted/40 shrink-0 size-8 inline-flex items-center justify-center'
                aria-label='Text color'
                style={{ backgroundColor: isBrightColor(color) ? '#3F3F46' : '#E4E4E7' }}
                isDisabled={state?.isCodeBlock}
            >
                <IconBaseline style={{ color }} />
            </Button>
            <Popover.Content className='sm:max-w-60'>
                <div className='grid grid-cols-10 gap-0.5 p-2'>
                    {Object.keys(colors).map((color) => (
                        <ColorSwatchPicker
                            key={color}
                            aria-label={color}
                            value={selectedColor}
                            onChange={handleColorChange}
                            className='grid gap-0.5'
                        >
                            {Object.values(colors[color]).map((color) => (
                                <ColorSwatchPicker.Item
                                    className='sm:*:data-[slot=color-swatch]:size-5'
                                    key={color}
                                    color={color}
                                />
                            ))}
                        </ColorSwatchPicker>
                    ))}
                    <ColorField
                        aria-label='Custom color'
                        value={selectedColor}
                        onChange={(value: Color | null) => {
                            if (value) {
                                handleColorChange(value)
                            } else {
                                editor.chain().unsetColor().run()
                            }
                        }}
                        className='col-span-5 mt-1 sm:*:[[role=group]]:h-8 sm:**:data-[slot=color-swatch]:size-5'
                    />
                    <Button
                        className='px-1 col-span-5 border hover:bg-muted/40 pressed:bg-muted/50 rounded-lg text-xs mt-1 cursor-pointer transition outline-hidden focus:ring-4 focus:border-primary/70 focus-visible:ring-4 focus-visible:border-primary/70 ring-ring'
                        onPress={() => editor.chain().unsetColor().run()}
                    >
                        Reset Default
                    </Button>
                </div>
            </Popover.Content>
        </Popover>
    )
}
