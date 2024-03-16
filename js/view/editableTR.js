
import { $, buenoCache } from '../main.js'

/** @type {HTMLTableRowElement | null} */
export let focusedRow

/** @type {HTMLTableCellElement} */
export let focusedCell

export let selectedRowID = 0

export const resetFocusedRow = () => {
    const dbtn = $('deletebtn')
    dbtn?.setAttribute('hidden', '')

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
            
            /** @type {HTMLTableCellElement} */
            const target = /** @type {HTMLTableCellElement} */(e.target)
            if (focusedRow && focusedCell && (e.target != focusedCell)) {
               focusedCell.removeAttribute('contenteditable')
                focusedCell.className = ""
                focusedCell.oninput = null
            }

            focusedRow?.classList.remove("selected_row")
            focusedRow = row
            selectedRowID = parseInt(focusedRow.dataset.row_id+'')
            focusedRow.classList.add("selected_row")
            const dbtn = /**@type {HTMLButtonElement} */($('deletebtn'))

            dbtn.removeAttribute('hidden')

            // we don't allow editing readonly cells
            if (target.attributes.getNamedItem('read-only')) {
                return // skip all read-only columns
            }
    
            focusedCell = /** @type {HTMLTableCellElement} */(e.target)
            focusedCell.setAttribute('contenteditable', '')
            focusedCell.className = "editable "
            focusedCell.onblur = () => {
                const id = parseInt(/**@type {HTMLTableRowElement}*/(focusedRow).dataset.row_id+'')
                const col = focusedCell.dataset.column_id || 0
                const rowObj = buenoCache.get(id)
                const currentValue = rowObj[col]
                const newValue = focusedCell.textContent
                if (currentValue != newValue) {
                    rowObj[col] = newValue
                    buenoCache.set(id, rowObj)
                }
            }
            focusedCell.focus()
        }
    }
}

