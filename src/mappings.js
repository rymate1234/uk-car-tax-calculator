/**
 * Calculates car tax for vehicles registered between 1 March 2001 and 31 March 2017
 * @param {Date} registrationDate When the vehicle was registered
 * @param {number} co2 Amount of CO2 produced
 */
export function getPre2017Mappings(registrationDate, co2) {
  const pre2006 = new Date(2006, 2, 23)
  const values = [
    { co2: 100, price: 0 },
    { co2: 110, price: 20 },
    { co2: 120, price: 30 },
    { co2: 130, price: 125 },
    { co2: 140, price: 145 },
    { co2: 150, price: 160 },
    { co2: 165, price: 200 },
    { co2: 175, price: 235 },
    { co2: 185, price: 260 },
    { co2: 200, price: 300 }
  ]

  for (const value of values) {
    const price = value.price
    if (co2 <= value.co2) return price
  }

  if (co2 <= 225 || (co2 > 226 && pre2006 > registrationDate)) return 325

  if (co2 <= 255) return 555
  if (co2 > 255) return 570
}

/**
 * Calculates car tax for vehicles registered after April 2017
 * @param {number} co2 Amount of CO2 produced
 * @param {boolean} meetsRDE2 Whether the vehicle meets RDE2
 */
export function getMappings(co2, meetsRDE2) {
  const taxes = [0, 10, 25, 110, 130, 150, 170, 210, 530, 855, 1280, 1815, 2135]
  const thresholds = [0, 50, 75, 90, 100, 110, 130, 150, 170, 190, 225, 255]

  if (!meetsRDE2) {
    taxes.splice(1, 1)
    taxes.push(taxes[taxes.length - 1])
  }

  for (const threshold of thresholds) {
    const price = taxes.shift()
    if (co2 <= threshold) return price
  }

  if (co2 > 255) return taxes.shift()
}
