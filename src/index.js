import { getPre2017Mappings, getMappings } from './mappings'

const HistoricVehicle = new Date(1979, 0, 1)
const PreCO2 = new Date(2001, 2, 1)
const April2017 = new Date(2017, 3, 1)

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
  if (fuel !== 'Petrol' && fuel !== 'Diesel') {
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
  if (fuel != 'Diesel') {
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
  const { registrationDate, engineSize, co2, fuel, meetsRDE2, value } = options
  if (registrationDate < HistoricVehicle) {
    return 0
  }

  const isCurrent = registrationDate >= April2017

  if (fuel === 'Electric') {
    return value > 40000 && isCurrent ? 320 : 0
  }

  if (registrationDate < PreCO2) {
    return calculateEngineSizeCarTax(engineSize)
  }

  if (registrationDate >= PreCO2 && registrationDate < April2017) {
    return calculatePre2017CarTax(registrationDate, co2, fuel)
  }

  if (isCurrent) {
    return calculateCurrentCarTax(co2, fuel, meetsRDE2)
  }
}

export default calculateTax
