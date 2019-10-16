const calc = require('../dist')

describe('Historic Vehicles', () => {
  const registrationDate = new Date(1978, 1, 1)

  test('should return 0 when calculating a car before 1979-01-01', () => {
    expect(calc({ registrationDate }).price).toBe(0)
  })
})

describe('Electric Vehicles', () => {
  const registrationDate = new Date(2018, 3, 1)

  test('should return 0 when an electric car', () => {
    expect(calc({ registrationDate, co2: 123, fuel: 'Electric' }).price).toBe(0)
  })

  test('should return 320 when an electric car with a value more than £40000', () => {
    expect(
      calc({ registrationDate, co2: 123, fuel: 'Electric', value: 45000 }).price
    ).toBe(320)
  })
})

describe('Vans', () => {
  test('should return 260 when registered on or after 1 March 2001', () => {
    const registrationDate = new Date(2018, 3, 1)
    const taxInfo = calc({ registrationDate, co2: 123, type: 'Van' })
    expect(taxInfo.price).toBe(260)
  })

  test('should return 260 when registered before 1 March 2001', () => {
    const registrationDate = new Date(1979, 1, 1)
    expect(
      calc({ registrationDate, co2: 123, type: 'Van', engineSize: 1549 }).price
    ).toBe(155)
  })

  test('should return 140 for a euro 4 compliant van', () => {
    const registrationDate = new Date(2004, 1, 1)
    expect(
      calc({ registrationDate, co2: 123, type: 'Van', euroStandard: 4 }).price
    ).toBe(140)
  })

  test('should return 140 for a euro 5 compliant van', () => {
    const registrationDate = new Date(2009, 1, 1)
    expect(
      calc({ registrationDate, co2: 123, type: 'Van', euroStandard: 5 }).price
    ).toBe(140)
  })

  test('should return 0 for an electric van', () => {
    const registrationDate = new Date(2018, 3, 1)
    expect(
      calc({ registrationDate, co2: 123, type: 'Van', fuel: 'Electric' }).price
    ).toBe(0)
  })
})

describe('Registered before 1 March 2001', () => {
  const registrationDate = new Date(1979, 1, 1)

  test('should return 155 with an engine size of 1549 or less', () => {
    expect(calc({ registrationDate, engineSize: 1549 }).price).toBe(155)
    expect(calc({ registrationDate, engineSize: 1349 }).price).toBe(155)
  })

  test('should return 255 with an engine size of greater than 1549', () => {
    expect(calc({ registrationDate, engineSize: 1599 }).price).toBe(255)
  })

  test('should return the correct tax category', () => {
    expect(calc({ registrationDate, engineSize: 1599 }).category).toBe('TC11')
  })
})

describe('Registered between 1 March 2001 and 31 March 2017', () => {
  const registrationDate = new Date(2001, 3, 1)
  const date2006 = new Date(2006, 3, 1)

  test('should return 0 with CO2 emissions of 100 or less', () => {
    expect(calc({ registrationDate, co2: 0 }).price).toBe(0)
    expect(calc({ registrationDate, co2: 100 }).price).toBe(0)
  })

  test('should return 20 with CO2 emissions between 100 and 110 or less', () => {
    expect(calc({ registrationDate, co2: 101, fuel: 'Petrol' }).price).toBe(20)
    expect(calc({ registrationDate, co2: 101, fuel: 'Diesel' }).price).toBe(20)
  })

  test('should return 325 with CO2 emissions 201 or above before 23rd march 2006', () => {
    expect(calc({ registrationDate, co2: 201, fuel: 'Petrol' }).price).toBe(325)
    expect(calc({ registrationDate, co2: 255, fuel: 'Diesel' }).price).toBe(325)
    expect(calc({ registrationDate, co2: 256, fuel: 'Diesel' }).price).toBe(325)
  })

  test('should return 325 with CO2 emissions 201-225 or above after 23rd march 2006', () => {
    expect(
      calc({ registrationDate: date2006, co2: 201, fuel: 'Petrol' }).price
    ).toBe(325)
    expect(
      calc({ registrationDate: date2006, co2: 255, fuel: 'Diesel' }).price
    ).toBe(555)
    expect(
      calc({ registrationDate: date2006, co2: 256, fuel: 'Diesel' }).price
    ).toBe(570)
  })

  test('should return 10 less than petrol / diesel with alternative fuels', () => {
    expect(calc({ registrationDate, co2: 101, fuel: 'Hybrid' }).price).toBe(10)
    expect(calc({ registrationDate, co2: 201, fuel: 'Hybrid' }).price).toBe(315)
    expect(calc({ registrationDate, co2: 255, fuel: 'Hybrid' }).price).toBe(315)
    expect(calc({ registrationDate, co2: 256, fuel: 'Hybrid' }).price).toBe(315)

    expect(
      calc({ registrationDate: date2006, co2: 201, fuel: 'Hybrid' }).price
    ).toBe(315)
    expect(
      calc({ registrationDate: date2006, co2: 255, fuel: 'Hybrid' }).price
    ).toBe(545)
    expect(
      calc({ registrationDate: date2006, co2: 256, fuel: 'Hybrid' }).price
    ).toBe(560)
  })

  test('should return the correct tax band', () => {
    expect(calc({ registrationDate, co2: 256, fuel: 'Petrol' }).band).toBe('K')
    expect(calc({ registrationDate, co2: 256, fuel: 'Diesel' }).band).toBe('K')
    expect(calc({ registrationDate, co2: 256, fuel: 'Hybrid' }).band).toBe('K')

    expect(
      calc({ registrationDate: date2006, co2: 256, fuel: 'Petrol' }).band
    ).toBe('M')
    expect(
      calc({ registrationDate: date2006, co2: 256, fuel: 'Diesel' }).band
    ).toBe('M')
    expect(
      calc({ registrationDate: date2006, co2: 256, fuel: 'Hybrid' }).band
    ).toBe('M')
  })
})

describe('Registered on or after 1 April 2017', () => {
  const registrationDate = new Date(2018, 3, 1)

  test('should return 0 with CO2 emissions of 0', () => {
    expect(calc({ registrationDate, co2: 0, fuel: 'Petrol' }).price).toBe(0)
    expect(calc({ registrationDate, co2: 1, fuel: 'Petrol' }).price).not.toBe(0)
  })

  test('should return 0 with CO2 emissions of 50 or less for hybrids', () => {
    expect(calc({ registrationDate, co2: 0, fuel: 'Hybrid' }).price).toBe(0)
    expect(calc({ registrationDate, co2: 49, fuel: 'Hybrid' }).price).toBe(0)
    expect(calc({ registrationDate, co2: 51, fuel: 'Hybrid' }).price).not.toBe(
      0
    )
  })

  test('should return the right value for CO2 emissions of 1 - 50', () => {
    expect(calc({ registrationDate, co2: 25, fuel: 'Petrol' }).price).toBe(10)
    expect(calc({ registrationDate, co2: 25, fuel: 'Diesel' }).price).toBe(25)

    expect(
      calc({ registrationDate, co2: 25, fuel: 'Diesel', meetsRDE2: true }).price
    ).toBe(10)
  })

  test('should return the right value for CO2 emissions of 226 - 255', () => {
    expect(calc({ registrationDate, co2: 230, fuel: 'Petrol' }).price).toBe(
      1815
    )
    expect(calc({ registrationDate, co2: 230, fuel: 'Diesel' }).price).toBe(
      2135
    )
    expect(calc({ registrationDate, co2: 230, fuel: 'Hybrid' }).price).toBe(
      1805
    )

    expect(
      calc({ registrationDate, co2: 230, fuel: 'Diesel', meetsRDE2: true })
        .price
    ).toBe(1815)
  })

  test('should return the right value for max CO2 emissions (>255)', () => {
    expect(calc({ registrationDate, co2: 256, fuel: 'Petrol' }).price).toBe(
      2135
    )
    expect(calc({ registrationDate, co2: 256, fuel: 'Diesel' }).price).toBe(
      2135
    )
    expect(calc({ registrationDate, co2: 256, fuel: 'Hybrid' }).price).toBe(
      2125
    )

    expect(
      calc({ registrationDate, co2: 256, fuel: 'Diesel', meetsRDE2: true })
        .price
    ).toBe(2135)
  })
})

describe('Tax Categories', () => {
  const registrationDate = new Date(2018, 3, 1)

  test('should return TC48 for petrol', () => {
    expect(calc({ registrationDate, fuel: 'Petrol' }).category).toBe('TC48')
  })

  test('should return TC49 for diesel', () => {
    expect(calc({ registrationDate, fuel: 'Diesel' }).category).toBe('TC49')
  })
  
  test('should return TC59 for alternative fuels', () => {
    expect(calc({ registrationDate, fuel: 'Hybrid' }).category).toBe('TC59')
  })
})
