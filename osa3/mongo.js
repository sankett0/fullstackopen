const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
  `mongodb+srv://sanket:${password}@cluster0.aklmx.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  Contact.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(c => {
      console.log(`${c.name} ${c.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const contact = new Contact({
    name: contactName,
    number: contactNumber
  })

  contact.save().then(() => {
    mongoose.connection.close()
  })
}
