
import { buenoCache } from '../main.js'

export const OrderDirection = {
   ASC: 'ASC',
   DESC: 'DESC',
   UNORDERED: 'UNORDERED',
}

/**
 * Reorder our dataset 
 *
 * @param {string} column
 * @param {string} direction
 */
export const orderData = (column, direction) => {
   switch (direction) {
      case OrderDirection.ASC:
         buenoCache.querySet.sort((a, b) => a[column] > b[column] ? 1 : -1)
         break;
      case OrderDirection.DESC:
         buenoCache.querySet.sort((a, b) => a[column] < b[column] ? 1 : -1)
         break;
      case OrderDirection.UNORDERED: // remove any sorting
         buenoCache.querySet.sort((a, b) => a['id'] > b['id'] ? 1 : -1)
         buenoCache.resetData()
         break;
      default:
         break;
   }
}

/** 
 * apply any existing sort order 
 */
export const applyOrder = () => {
   const indicators = document.querySelectorAll('.indicator')
   for (const ind of Array.from(indicators)) {
      const index = parseInt(ind?.parentElement?.dataset.index + '')
      const dir = buenoCache.columns[index].order
      orderData(buenoCache.columns[index].name, dir)

   }
}