import { Table as TiptapTable } from '@tiptap/extension-table'
import { TableCell as TiptapTableCell } from '@tiptap/extension-table-cell'
import { TableHeader as TiptapTableHeader } from '@tiptap/extension-table-header'
import { TableRow as TiptapTableRow } from '@tiptap/extension-table-row'

export const Table = TiptapTable.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            resizable: true,
            cellMinWidth: 100,
        }
    },
})

export const TableCell = TiptapTableCell.extend({
    addOptions() {
        return {
            ...this.parent?.(),
        }
    },
})

export const TableHeader = TiptapTableHeader.extend({
    addOptions() {
        return {
            ...this.parent?.(),
        }
    },
})

export const TableRow = TiptapTableRow.extend({
    addOptions() {
        return {
            ...this.parent?.(),
        }
    },
})
