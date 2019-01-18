const { twoSum, twoSumOptimized } = require('../two-sum')

describe('twoSum', () => {
  test('#1', () => {
    const result = twoSum([2, 7, 11, 15], 9)
    expect(result).toEqual([0, 1])
  })

  test('#1 optimized', () => {
    const result = twoSumOptimized([2, 7, 11, 15], 9)
    expect(result).toEqual([0, 1])
  })

  test('#2', () => {
    const result = twoSum([3, 2, 4], 6)
    expect(result).toEqual([1, 2])
  })

  test('#2 optimized', () => {
    const result = twoSumOptimized([3, 2, 4], 6)
    expect(result).toEqual([1, 2])
  })

  test('#3', () => {
    const result = twoSum([3, 9, 4, 11, 2, 8], 5)
    expect(result).toEqual([0, 4])
  })

  test('#3 optimized', () => {
    const result = twoSumOptimized([3, 9, 4, 11, 2, 8], 5)
    expect(result).toEqual([0, 4])
  })

  test('#4', () => {
    const result = twoSum([3, 3], 6)
    expect(result).toEqual([0, 1])
  })

  test('#4 optimized', () => {
    const result = twoSumOptimized([3, 3], 6)
    expect(result).toEqual([0, 1])
  })
})
