import { filterData } from '../data/filter.js'
import { orderData } from  '../data/order.js'
import { paginateData } from '../data/paginate.js'
import { OrderDirection } from '../data/order.js'
import { $, buenoCache } from '../main.js'
import { buildDataTable, buildTableHead } from './domDataTable.js'

const UP = '🔼'
const DOWN = '🔽'
const NOT = '🔃'

const resetIndicators = () => {
    const indicators = document.querySelectorAll('.indicator')
    for (const ind of Array.from(indicators)) {
        //@ts-ignore ?
        const index = parseInt(ind.parentElement.dataset.index)
        buenoCache.columns[index].order = OrderDirection.UNORDERED
        ind.textContent = NOT  
    }
}

/** Initialize DOM elements, and attach common event handlers */
export const initDOMelements = () => {
   


    // build the table head section
    buildTableHead()

    /** the currently focused header input element */
    let focusedInput

    // assign click handlers for column headers
    for (let i = 0; i < buenoCache.columns.length; i++) {
        const el = $(`header${i + 1}`)
        //@ts-ignore
        el.onclick = (e) => {
         //@ts-ignore
            const { tagName } = e.target
            const { ASC, DESC, UNORDERED } = OrderDirection
            if (tagName === 'INPUT') return
            const header = e.currentTarget
            //@ts-ignore
            const indicator = header.querySelector('.indicator')
            //@ts-ignore
            const index = parseInt(header.dataset.index+'')
            const colName = buenoCache.columns[index].name
            const currentOrder = buenoCache.columns[index].order

            if (currentOrder == UNORDERED) {
                resetIndicators()
                buenoCache.columns[index].order = ASC
                orderData(colName, ASC)
                if (indicator) indicator.textContent = DOWN
            }
            else if (currentOrder == ASC) {
                resetIndicators()
                buenoCache.columns[index].order = DESC
                orderData(colName, DESC)
                if (indicator) indicator.textContent = UP
            }
            else if (currentOrder == DESC) {
                if (indicator) indicator.textContent = NOT
                buenoCache.columns[index].order = UNORDERED
                resetIndicators()
                orderData(colName, UNORDERED)
                paginateData()
            }

            buildDataTable()
        }
    }

    // assign `keyup` handlers for header input elements
    for (let i = 0; i < buenoCache.columns.length; i++) {

        const el = $(`input${i + 1}`)
        //@ts-ignore
        el.onkeyup = () => {
         //@ts-ignore
            filterData(buenoCache.columns[i].name, el.value)
            if (focusedInput) {
                if (focusedInput != el) {
                    focusedInput.value = ''
                    focusedInput = el
                }
            } else {
                focusedInput = el
                //@ts-ignore
                filterData(buenoCache.columns[i].name, el.value)
            }
        }
    }
}