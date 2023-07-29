const shuffle = require("../src/shuffle");
const testArr = [0, 1, 2, 3, 4, 5, 6, 7]
const shuffledArr = shuffle(testArr)

describe("shuffle should return an array of all the items from the original array in a different order", () => {
  test('should be array type', () => {
    expect(Array.isArray(shuffledArr)).toBeTruthy()
  })

  test('array should be in different order', () => {
    expect(shuffledArr).not.toBe(testArr)
  })

  test('array should contain all the same values', () => {
    expect(shuffledArr).toContain(0, 1, 2, 3, 4, 5, 6, 7)
    expect(shuffledArr).not.toContain(8)
  })
});