import React from 'react'

import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { Popover } from '@/components/ui'
import { useMediaQuery } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { Editor } from '@tiptap/react'
import { IconTable } from 'hq-icons'
import { Collection } from 'react-aria-components'

export interface GridSize {
    rows: number
    cols: number
}

export const Table = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = React.useState<boolean>(false)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const [selectedTableGridSize, setSelectedTableGridSize] = React.useState<GridSize>({
        rows: 0,
        cols: 0,
    })

    function selectTableGridSize(rows: number, cols: number): void {
        if (rows === selectedTableGridSize.rows) {
            setSelectedTableGridSize((prev) => {
                return {
                    ...prev,
                    rows: Math.min(rows + 1),
                }
            })
        }

        if (cols === selectedTableGridSize.cols) {
            setSelectedTableGridSize((prev) => {
                return {
                    ...prev,
                    cols: Math.min(cols + 1),
                }
            })
        }

        setSelectedTableGridSize({
            rows,
            cols,
        })
    }

    function onMouseDown(rows: number, cols: number) {
        editor?.chain().insertTable({ rows, cols, withHeaderRow: false }).run()
        setSelectedTableGridSize({
            rows: 0,
            cols: 0,
        })
        setOpen(false)
    }

    return isMobile ? (
        <ToolbarButton
            tooltip='Insert Table'
            isSelected={false}
            onPress={() => onMouseDown(3, 3)}
            isDisabled={!editor?.can().insertTable()}
        >
            <IconTable />
        </ToolbarButton>
    ) : (
        <Popover isOpen={open} onOpenChange={setOpen}>
            <ToolbarButton
                tooltip='Insert Table'
                onPress={() => setOpen(true)}
                isSelected={false}
                isDisabled={!editor?.can().insertTable()}
            >
                <IconTable />
            </ToolbarButton>
            <Popover.Content>
                <Popover.Header className='px-4 pt-4 pb-0 sm:text-center text-sm font-semibold'>
                    {selectedTableGridSize.rows} ✕ {selectedTableGridSize.cols}
                </Popover.Header>
                <Popover.Body className='pb-4'>
                    <div className='grid grid-cols-8 gap-0.5 grid-rows-8 justify-between' aria-label='Table size'>
                        <Collection
                            items={Array.from({ length: 8 * 8 }).map((_, row) => ({
                                row: Math.floor(row / 8) + 1,
                                col: (row % 8) + 1,
                            }))}
                        >
                            {(item) => (
                                <div
                                    id={`${item.row}-${item.col}`}
                                    className={cn(
                                        'size-5 rounded-sm outline-hidden border',
                                        selectedTableGridSize.rows >= item.row &&
                                            selectedTableGridSize.cols >= item.col &&
                                            'bg-primary',
                                    )}
                                    onMouseEnter={() => {
                                        selectTableGridSize(item.row, item.col)
                                    }}
                                    onMouseUp={() => onMouseDown(item.row, item.col)}
                                />
                            )}
                        </Collection>
                    </div>
                </Popover.Body>
            </Popover.Content>
        </Popover>
    )
}
