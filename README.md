# UK Car Tax calculator

A node module to calculate car tax rates in the UK based on the fuel type, engine size and when the vehicle was registered.

[![Build Status](https://dev.azure.com/supermarioryan0324/uk-car-tax-calculator/_apis/build/status/rymate1234.uk-car-tax-calculator?branchName=master)](https://dev.azure.com/supermarioryan0324/uk-car-tax-calculator/_build/latest?definitionId=1&branchName=master)

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

console.log(tax) // prints 315
```

For a more comprehensive uide to usage check `test/index.test.js`

## Contributing

PRs accepted, especially those concering updates to UK law.

This project is linted with `eslint` using prettier, and runs tests with `jest` - these will need to pass before any PR is accepted.
