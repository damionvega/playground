/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = function(nums, target) {
  let matches = []

  for (let i = 0; i < nums.length; i++) {
    const numA = nums[i]

    for (let j = 0; j < nums.length; j++) {
      const numB = nums[j]

      if (i !== j && numA + numB === target) {
        if (!matches.includes(i)) {
          matches.push(i)

          if (matches.length === 2) {
            return matches
          }
        }
      }
    }
  }

  return matches
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSumOptimized = function(nums, target) {
  let obj = {}

  for (let i = 0; i < nums.length; i++) {
    let inverseKey = target - nums[i]

    if (obj[inverseKey] != undefined) {
      return [obj[inverseKey], i]
    }

    obj[nums[i]] = i
  }
}

module.exports = {
  twoSum,
  twoSumOptimized,
}
