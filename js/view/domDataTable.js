
import { makeEditableRow,  resetFocusedRow  } from './editableTR.js'
import { buildPageButtons, } from './domPageButtons.js'
import { $, buenoCache } from '../main.js'
import { paginateData } from '../data/paginate.js'
//import { ObjectLiteral } from '../data/types.ts';
  

let tableBody

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 
 * Build the Table header
 */
export const buildTableHead = () => {
    //TODO /** @type {HTMLTableElement} */
    const tablehead = $('table-head')
    const tr = `
<tr class="headerRow">
`;
    let th = ''
    for (let i = 0; i < buenoCache.columns.length; i++) {
   th += `    <th id="header${i + 1}" 
   data-index=${i} value=1> ${capitalizeFirstLetter(buenoCache.columns[i].name)} 
   <span class="indicator">🔃</span>
   <input id="input${i + 1}" type="text">
</th>
`;
    }
    //@ts-ignore
    tablehead.innerHTML += (tr + th)
    //@ts-ignore
    tablehead.innerHTML += `</tr>`
}

/** build HTML table */
export const buildDataTable = () => {
   
    if (!tableBody) tableBody = $('table-body')
    const { querySet, totalPages } = paginateData()
    tableBody.innerHTML = '';
    //@ts-ignore
    $('h1').className = 'hidden'
    //@ts-ignore
    for (let i = 0; i < querySet.length; i++) {
      //@ts-ignore
        const obj = querySet[i]
        
        let row = `<tr data-row_id="${obj[buenoCache.columns[0].name]} ">
        `
        for (let i = 0; i < buenoCache.columns.length; i++) {
            const ro = (buenoCache.columns[i].readOnly) ? ' read-only' : ''
            row += `<td data-column_id="${buenoCache.columns[i].name}"${ro}>${obj[buenoCache.columns[i].name]}</td>
            `
        }
        row += '</tr>'
        tableBody.innerHTML += row
    }
    resetFocusedRow()
    buildPageButtons(totalPages)
    makeEditableRow()

}
