import { $, buenoCache } from '../main.js'

/**
 * @type {HTMLTableRowElement}
 */
export let focusedRow
/**
 * @type {EventTarget}
 */
export let focusedCell
export let selectedRowID = 0

export const resetFocusedRow = () => {
    const dbtn = $('deletebtn')
    dbtn?.setAttribute('hidden', '')
    //@ts-ignore ?
    focusedRow = null
}

/** build table row event handlers for editing */
export function makeEditableRow() {
    const rows = document.querySelectorAll('tr')
    for (const row of Array.from(rows)) {
        if (row.className.startsWith('headerRow')) {
            // skip the table-header row
            continue
        }

        row.onclick = (e) => {

            const target = e.target //as HTMLTableCellElement
            if (focusedRow && focusedCell && (e.target != focusedCell)) {
               //@ts-ignore 
               focusedCell.removeAttribute('contenteditable')
               //@ts-ignore 
                focusedCell.className = ""
                //@ts-ignore 
                focusedCell.oninput = null
            }

            focusedRow?.classList.remove("selected_row")
            focusedRow = row
            selectedRowID = parseInt(focusedRow.dataset.row_id+'')
            focusedRow.classList.add("selected_row")
            const dbtn = $('deletebtn')
            //@ts-ignore 
            dbtn.removeAttribute('hidden')

            // we don't allow editing readonly cells
            //@ts-ignore 
            if (target.attributes.getNamedItem('read-only')) {
                return // skip all read-only columns
            }
            //@ts-ignore 
            focusedCell = e.target
            //@ts-ignore
            focusedCell.setAttribute('contenteditable', '')
            //@ts-ignore
            focusedCell.className = "editable "
            //@ts-ignore
            focusedCell.onblur = () => {
                const id = parseInt(focusedRow.dataset.row_id+'')
                //@ts-ignore
                const col = focusedCell.dataset.column_id || 0
                const rowObj = buenoCache.get(id)
                const currentValue = rowObj[col]
                //@ts-ignore
                const newValue = focusedCell.textContent
                if (currentValue != newValue) {
                    rowObj[col] = newValue
                    buenoCache.set(id, rowObj)
                }
            }
            //@ts-ignore
            focusedCell.focus()
        }
    }
}

