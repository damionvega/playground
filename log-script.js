/**
 * Challenge:
 *
 * Write a script that, given a web server log file, returns the 10 most frequently
 * requested objects and their cumulative bytes transferred. Only include GET requests
 * with Successful (HTTP 2xx) responses. Resolve ties however you’d like.
 *
 * Log format:
 * - request date, time, and time zone
 * - request line from the client
 * - HTTP status code returned to the client - size (in bytes) of the returned object
 *
 * Given this input data:
 * ```
 * [01/Aug/1995:00:54:59 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511
 * [01/Aug/1995:00:55:04 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 200 3635
 * [01/Aug/1995:00:55:06 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 403 298
 * [01/Aug/1995:00:55:09 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 200 3635
 * [01/Aug/1995:00:55:18 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall1.gif HTTP/1.0" 200 4231
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall2.gif HTTP/1.0" 200 1042
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall3.gif HTTP/1.0" 200 2322
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall4.gif HTTP/1.0" 200 1807
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall5.gif HTTP/1.0" 200 2119
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall6.gif HTTP/1.0" 200 3418
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall7.gif HTTP/1.0" 200 2252
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall8.gif HTTP/1.0" 200 2843
 * [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall9.gif HTTP/1.0" 200 2910
 * ```
 *
 * The result should be:
 * ```
 * /images/opf-logo.gif 65022
 * /images/ksclogosmall.gif 7270
 * /images/ksclogosmall1.gif 4231
 * /images/ksclogosmall6.gif 3418
 * /images/ksclogosmall9.gif 2910
 * /images/ksclogosmall8.gif 2843
 * /images/ksclogosmall3.gif 2322
 * /images/ksclogosmall7.gif 2252
 * /images/ksclogosmall5.gif 2119
 * /images/ksclogosmall4.gif 1807
 * ```
 *
 * (You may tweak the output format as you'd like)
 */

/**
 * Run this script by passing a log file to the script.
 * e.g. `$ node log-script.js log`
 */

const fs = require('fs')
const lineReader = require('readline')

const file = process.argv[2]
const fileName = file.split('.')[0]
const fileExtension = file.split('.')[1] || '' // Accept log file with extension or simply "log"

let requests = []

lineReader
  .createInterface({
    input: require('fs').createReadStream(file),
  })
  .on('line', line => {
    // We're only looking for GET requests that returned a 2xx status code
    if (!line || !isValidRequest(line)) {
      return
    }

    const requestStr = getRequestString(line)
    const numBytes = getNumBytes(line)

    if (!requests.length) {
      const item = createRequestItem(requestStr, numBytes)
      requests.push(item)
      return
    }

    // If we find the request string already in the collection, simply increment the number of requests
    for (const obj of requests) {
      const match = obj.requestObject === requestStr

      if (match) {
        obj.count += 1
        obj.numBytes += numBytes
        return
      }
    }

    // Add a new item now that we know it doesn't exist
    const item = createRequestItem(requestStr, numBytes)
    requests.push(item)
  })
  .on('close', writeRequestsToFile)

/**
 * @function isValidRequest
 * @param {string} line String at current line of file
 * @returns {boolean}
 */
function isValidRequest(line) {
  const lineArr = line.split('"').map(str => str.trim())

  const isGetRequest = lineArr[1].split(' ')[0] === 'GET'
  const statusCode = lineArr[2].split(' ')[0]

  return isGetRequest && statusCode >= '200' && statusCode < '300'
}

/**
 * @function getRequestString
 * @param {string} line String at current line of file
 * @returns {string} // e.g. "/images/ksclogosmall.gif"
 */
function getRequestString(line) {
  const lineArr = line.split('"').map(str => str.trim())
  return lineArr[1].split(' ')[1]
}

/**
 * @function getNumBytes
 * @param {string} line String at current line of file
 * @returns {number} // e.g. 2135
 */
function getNumBytes(line) {
  const lineArr = line.split('"').map(str => str.trim())
  const numBytes = lineArr[2].split(' ')[1]
  return Number(numBytes)
}

/**
 * @function createRequestItem
 * @param {string} requestStr String containing the request
 * @param {number} numBytes The number of bytes transferred of request
 * @returns {object}
 */
function createRequestItem(requestStr, numBytes) {
  return {
    count: 1,
    requestObject: requestStr,
    numBytes,
  }
}

/**
 * @function writeRequestsToFile
 * @description Runs through our collection of requests found and sorts them
 * first by count then number of bytes to give some sort of precendence. These
 * are then put into a string separated by a new line then written to a file
 * with "-output" appended to the end of the original filename passed to the script.
 */
function writeRequestsToFile() {
  let lines = requests
    .sort((itemA, itemB) => itemA.count - itemB.count)
    .sort((itemA, itemB) => itemA.numBytes - itemB.numBytes) // If we have some requests that tied for count, we'll sort them by `numBytes`
    .reverse() // Sort returns the array in ascending order, so we'll reverse it in order to have the request that was requested the most at the top
    .map(item => `${item.requestObject} ${item.numBytes}`)
    .slice(0, 10)

  // Take each line in the array and put it on a new line of the string
  let content = lines.join('\n')

  const newFileName = fileExtension.trim()
    ? `${fileName}-output.${fileExtension}`
    : `${fileName}-output`

  // Finally, write the results to a file
  fs.writeFile(newFileName, content, err => {
    if (err) return console.error(err)
    console.log(
      `The 10 most frequently requested objects were written to "${newFileName}"!`,
    )
  })
}
