const file = process.argv[2] /// Example: my-data.json
const filename = file.split('.json')[0]

const fs = require('fs')
const _ = require('lodash')

fs.readFile(file, 'utf8', (err, data) => {
  if (err) return console.log(err)

  /// Our JSON response contains an object with a single `results` key with the results
  let json = JSON.parse(data).results

  /// Remove all blank emails
  let emails = json
    .filter(item => !_.isUndefined(item.email) && !_.isEmpty(item.email))
    .map(item => item.email)

  /// Create a `content` string and add all of the emails to it on a new line
  let content = 'email\n'

  emails.forEach(email => {
    content += `${email}\n`
  })

  /// Finally, write the file with the file name and .csv extension
  fs.writeFile(`./${filename}.csv`, content, err => {
    if (err) return console.log(err)
    console.log('The file was saved!')
  })
})
