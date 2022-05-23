const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log('successfully connected to mongodb')
}).catch(err => {
  console.log('failed to connect to database')
  console.log(err)
})

const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)