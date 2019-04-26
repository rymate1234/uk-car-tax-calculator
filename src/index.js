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
  return reduceIfAlternative(tax, fuel)
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
  return reduceIfAlternative(tax, fuel)
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

  if (registrationDate < HistoricVehicle) {
    return 0
  }

  fuel = fuel.toLowerCase()
  type = type.toLowerCase()

  const isCurrent = registrationDate >= April2017

  if (fuel === 'electric') {
    return value > 40000 && isCurrent ? 320 : 0
  }

  if (registrationDate < PreCO2) {
    return calculateEngineSizeCarTax(engineSize)
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
      return 140
    }

    return 260
  }

  if (registrationDate >= PreCO2 && registrationDate < April2017) {
    return calculatePre2017CarTax(registrationDate, co2, fuel)
  }

  if (isCurrent) {
    return calculateCurrentCarTax(co2, fuel, meetsRDE2)
  }
}

export default calculateTax
