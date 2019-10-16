# UK Car Tax calculator

A node module to calculate vehicle tax rates for cars and vans in the UK based on the fuel type, engine size and when the vehicle was registered.

[![Build Status](https://dev.azure.com/supermarioryan/UK%20Car%20Tax%20Calculator/_apis/build/status/rymate1234.uk-car-tax-calculator?branchName=master)](https://dev.azure.com/supermarioryan/UK%20Car%20Tax%20Calculator/_build/latest?definitionId=3&branchName=master)

## Installation

```
npm install uk-car-tax-calculator
```

## Usage

```js
const calculateTax = require('uk-car-tax-calculator') // or es modules

const tax = calculateTax({
  registrationDate: new Date(2001, 3, 1),
  co2: 201,
  fuel: 'Hybrid'
})

console.log(tax.price) // prints 315
```

For a more comprehensive guide to usage check `test/index.test.js`

## Contributing

PRs accepted, especially those concerning updates to UK law.

This project is linted with `eslint` using prettier, and runs tests with `jest` - these will need to pass before any PR is accepted.
