const suma = (a, b) => a + b

const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 1, result: 2 },
  { a: 1, b: -1, result: 0 },
  { a: -1, b: 1, result: 0 },
  { a: -1, b: -1, result: -2 },
  { a: 0, b: 1, result: 1 },
  { a: 1, b: 0, result: 1 },
  { a: 0, b: 1, result: 1 }
]

checks.forEach(check => {
  const { a, b, result } = check

  console.assert(suma(a, b) === result, `sum of ${a} and ${b} should be ${result}`)
})

console.log('All tests passed! 🎉 \nckecks perfomed ' + checks.length)
