const calc = require('../dist')

describe('Historic Vehicles', () => {
  const registrationDate = new Date(1978, 1, 1)

  test('returns 0 when calculating a car before 1979-01-01', () => {
    expect(calc({ registrationDate })).toBe(0)
  })
})

describe('Electric Vehicles', () => {
  const registrationDate = new Date(2018, 3, 1)

  test('returns 0 when an electric car', () => {
    expect(calc({ registrationDate, co2: 123, fuel: 'Electric' })).toBe(0)
  })

  test('returns 320 when an electric car with a value more than £40000', () => {
    expect(
      calc({ registrationDate, co2: 123, fuel: 'Electric', value: 45000 })
    ).toBe(320)
  })
})

describe('Registered before 1 March 2001', () => {
  const registrationDate = new Date(1979, 1, 1)

  test('returns 155 with an engine size of 1549 or less', () => {
    expect(calc({ registrationDate, engineSize: 1549 })).toBe(155)
    expect(calc({ registrationDate, engineSize: 1349 })).toBe(155)
  })

  test('returns 255 with an engine size of greater than 1549', () => {
    expect(calc({ registrationDate, engineSize: 1599 })).toBe(255)
  })
})

describe('Registered between 1 March 2001 and 31 March 2017', () => {
  const registrationDate = new Date(2001, 3, 1)
  const date2006 = new Date(2006, 3, 1)

  test('returns 0 with CO2 emissions of 100 or less', () => {
    expect(calc({ registrationDate, co2: 0 })).toBe(0)
    expect(calc({ registrationDate, co2: 100 })).toBe(0)
  })

  test('returns 20 with CO2 emissions between 100 and 110 or less', () => {
    expect(calc({ registrationDate, co2: 101, fuel: 'Petrol' })).toBe(20)
    expect(calc({ registrationDate, co2: 101, fuel: 'Diesel' })).toBe(20)
  })

  test('returns 325 with CO2 emissions 201 or above before 23rd march 2006', () => {
    expect(calc({ registrationDate, co2: 201, fuel: 'Petrol' })).toBe(325)
    expect(calc({ registrationDate, co2: 255, fuel: 'Diesel' })).toBe(325)
    expect(calc({ registrationDate, co2: 256, fuel: 'Diesel' })).toBe(325)
  })

  test('returns 325 with CO2 emissions 201-225 or above after 23rd march 2006', () => {
    expect(calc({ registrationDate: date2006, co2: 201, fuel: 'Petrol' })).toBe(
      325
    )
    expect(calc({ registrationDate: date2006, co2: 255, fuel: 'Diesel' })).toBe(
      555
    )
    expect(calc({ registrationDate: date2006, co2: 256, fuel: 'Diesel' })).toBe(
      570
    )
  })

  test('returns 10 less than petrol / diesel with alternative fuels', () => {
    expect(calc({ registrationDate, co2: 101, fuel: 'Hybrid' })).toBe(10)

    expect(calc({ registrationDate, co2: 201, fuel: 'Hybrid' })).toBe(315)
    expect(calc({ registrationDate, co2: 255, fuel: 'Hybrid' })).toBe(315)
    expect(calc({ registrationDate, co2: 256, fuel: 'Hybrid' })).toBe(315)

    expect(calc({ registrationDate: date2006, co2: 201, fuel: 'Hybrid' })).toBe(
      315
    )
    expect(calc({ registrationDate: date2006, co2: 255, fuel: 'Hybrid' })).toBe(
      545
    )
    expect(calc({ registrationDate: date2006, co2: 256, fuel: 'Hybrid' })).toBe(
      560
    )
  })
})

describe('Registered on or after 1 April 2017', () => {
  const registrationDate = new Date(2018, 3, 1)

  test('returns 0 with CO2 emissions of 0', () => {
    expect(calc({ registrationDate, co2: 0, fuel: 'Petrol' })).toBe(0)
    expect(calc({ registrationDate, co2: 1, fuel: 'Petrol' })).not.toBe(0)
  })

  test('returns 0 with CO2 emissions of 50 or less for hybrids', () => {
    expect(calc({ registrationDate, co2: 0, fuel: 'Hybrid' })).toBe(0)
    expect(calc({ registrationDate, co2: 49, fuel: 'Hybrid' })).toBe(0)
    expect(calc({ registrationDate, co2: 51, fuel: 'Hybrid' })).not.toBe(0)
  })

  test('returns the right value for CO2 emissions of 1 - 50', () => {
    expect(calc({ registrationDate, co2: 25, fuel: 'Petrol' })).toBe(10)
    expect(calc({ registrationDate, co2: 25, fuel: 'Diesel' })).toBe(25)

    expect(
      calc({ registrationDate, co2: 25, fuel: 'Diesel', meetsRDE2: true })
    ).toBe(10)
  })

  test('returns the right value for CO2 emissions of 226 - 255', () => {
    expect(calc({ registrationDate, co2: 230, fuel: 'Petrol' })).toBe(1815)
    expect(calc({ registrationDate, co2: 230, fuel: 'Diesel' })).toBe(2135)
    expect(calc({ registrationDate, co2: 230, fuel: 'Hybrid' })).toBe(1805)

    expect(
      calc({ registrationDate, co2: 230, fuel: 'Diesel', meetsRDE2: true })
    ).toBe(1815)
  })

  test('returns the right value for max CO2 emissions (>255)', () => {
    expect(calc({ registrationDate, co2: 256, fuel: 'Petrol' })).toBe(2135)
    expect(calc({ registrationDate, co2: 256, fuel: 'Diesel' })).toBe(2135)
    expect(calc({ registrationDate, co2: 256, fuel: 'Hybrid' })).toBe(2125)

    expect(
      calc({ registrationDate, co2: 256, fuel: 'Diesel', meetsRDE2: true })
    ).toBe(2135)
  })
})
