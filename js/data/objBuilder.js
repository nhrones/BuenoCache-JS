
const usersJson = await (await fetch(new URL("../data/hundredK.json", import.meta.url))).json()

/**
 * build a dataSet from json data
 * @param {number} size 
 * @returns {Promise} 
 */
export async function buildTestDataSet (size) {
   return new Promise((resolve, _reject) => {
      // neasure the construction
      const loadStart = performance.now()
      const tempMap = new Map(usersJson)
      
      console.log(`time to Load ${tempMap.size} json records - ${(performance.now() - loadStart).toFixed(2)} ms `);
      console.log(tempMap.get(0))
      const map = new Map()
      const showStart = performance.now();
      for (let index = 0; index < size; index++) {
         const user = tempMap.get(index).value
         user.id = index
         map.set(index, user)
      }
      console.log(`time to Build ${size} records - ${(performance.now() - showStart).toFixed(2)} ms `)
      resolve(map)
   });
};
