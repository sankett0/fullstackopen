require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Contact = require('./models/contact')

morgan.token('persons', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persons'))
app.use(express.static('build'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Contact.find({}).then(result => {
    res.json(result)
  }).catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (req.body.name === undefined || req.body.name.length < 3) {
    res.status(500).json({ 'error': 'name must be at least 3 characters long.' })
  } else if(req.body.number === undefined || req.body.number.length === 0) {
    res.status(500).json({ 'error': 'number not defined' })
  }
  else {
    const newContact = new Contact({
      name: body.name,
      number: body.number
    })
    newContact.save()
      .then(result => result.toJSON()).then(resultJson => {
        console.log(JSON.stringify(resultJson))
        res.json(resultJson)
      }).catch(err => next(err))

  }
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Contact.deleteOne({ _id: id }).then(result => {
    if (result.acknowledged && result.deletedCount === 1) {
      res.status(200).end()
    } else {
      res.status(500).end()
    }
  }).catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  Contact.countDocuments({}).then(result => {
    res.send(`Phonebook has info for ${result} people<br/>${new Date()}`)
  }).catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'ID is wrong' })
  }
  next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})