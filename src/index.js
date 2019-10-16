import { getPre2017Mappings, getMappings } from './mappings'

const HistoricVehicle = new Date(1979, 0, 1)
const PreCO2 = new Date(2001, 2, 1)
const April2017 = new Date(2017, 3, 1)

const Euro4Start = new Date(2003, 2, 1)
const Euro4End = new Date(2006, 11, 31)

const Euro5Start = new Date(2009, 0, 1)
const Euro5End = new Date(2010, 11, 31)

/**
 * Calculate tax based on engine size
 *
 * @param {number} engineSize Size of the engine
 * @returns {number} The tax amount
 */
function calculateEngineSizeCarTax(engineSize) {
  if (engineSize <= 1549) {
    return 155
  } else {
    return 255
  }
}

/**
 * Reduces tax by £10 if it's not a petrol / diesel car
 *
 * @param {number} tax Current tax amount
 * @param {string} fuel The fuel used
 * @returns {number} The final tax amount
 */
function reduceIfAlternative(tax, fuel) {
  if (fuel !== 'petrol' && fuel !== 'diesel') {
    return tax > 0 ? tax - 10 : 0
  }

  return tax
}

/**
 * Derives the tax category from the fuel of the vehicle
 *
 * @param {string} fuel The fuel used
 * @returns {string} The tax category
 */
function fuelToTaxCategory(fuel) {
  if (fuel === 'petrol') {
    return 'TC48'
  }

  if (fuel === 'diesel') {
    return 'TC49'
  }

  if (fuel !== 'petrol' && fuel !== 'diesel') {
    return 'TC59'
  }
}

/**
 * Calculates car tax for vehicles registered between 1 March 2001 and 31 March 2017
 *
 * @param {Date} registrationDate When the vehicle was registered
 * @param {number} co2 Amount of CO2 produced
 * @param {string} fuel The fuel used
 *
 * @returns {number} The final tax amount
 */
function calculatePre2017CarTax(registrationDate, co2, fuel) {
  const tax = getPre2017Mappings(registrationDate, co2)
  tax.price = reduceIfAlternative(tax.price, fuel)
  return tax
}

/**
 * Calculates car tax for vehicles registered on or after 1 April 2017
 *
 * @param {number} co2 Amount of CO2 produced
 * @param {string} fuel The fuel used
 * @param {boolean} meetsRDE2 Whether the vehicle meets RDE2
 * @returns {number} The final tax amount
 */
function calculateCurrentCarTax(co2, fuel, meetsRDE2) {
  if (fuel != 'diesel') {
    meetsRDE2 = true
  }
  const tax = getMappings(co2, meetsRDE2)
  tax.price = reduceIfAlternative(tax.price, fuel)
  return tax
}

/**
 * Calculate the current car tax of a vehicle
 * @param {VehicleInfo} options The list of vehicle options
 * @returns {number} The final tax amount
 */
function calculateTax(options) {
  let {
    registrationDate,
    engineSize,
    co2,
    fuel = '',
    meetsRDE2,
    value,
    type = '',
    euroStandard
  } = options

  const taxResult = {
    price: 0,
    category: '',
    band: ''
  }

  if (registrationDate < HistoricVehicle) {
    return taxResult
  }

  fuel = fuel.toLowerCase()
  type = type.toLowerCase()

  taxResult.category = fuelToTaxCategory(fuel)

  const isCurrent = registrationDate >= April2017

  if (fuel === 'electric') {
    taxResult.price = value > 40000 && isCurrent ? 320 : 0
    return taxResult
  }

  if (registrationDate < PreCO2) {
    taxResult.price = calculateEngineSizeCarTax(engineSize)
    taxResult.category = 'TC11'
    return taxResult
  }

  if (registrationDate >= PreCO2 && type === 'van') {
    const euro4Van =
      registrationDate >= Euro4Start &&
      registrationDate < Euro4End &&
      euroStandard === 4

    const euro5Van =
      registrationDate >= Euro5Start &&
      registrationDate < Euro5End &&
      euroStandard === 5

    if (euro4Van || euro5Van) {
      taxResult.price = 140
      taxResult.category = 'TC36'
    } else {
      taxResult.price = 260
      taxResult.category = 'TC39'
    }

    return taxResult
  }

  if (registrationDate >= PreCO2 && registrationDate < April2017) {
    return Object.assign(
      {},
      taxResult,
      calculatePre2017CarTax(registrationDate, co2, fuel)
    )
  }

  if (isCurrent) {
    return Object.assign(
      {},
      taxResult,
      calculateCurrentCarTax(co2, fuel, meetsRDE2)
    )
  }
}

export default calculateTax
