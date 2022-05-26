const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

router.get('/', async (request, response) => {
    const allUsers = await User.find({})
        .populate('blogs', {url: 1, title: 1, author: 1})
    response.json(allUsers)
})

router.post('/', async (request, response) => {

    const {username, name, password} = request.body

    const exists = await User.findOne({username})
    if (exists)  {
        return response.status(400).json({
            "error": `name ${username} already exists`
        })
    }
    if ((username.length < 3) || (username === undefined)) {
        return response.status(400).json({
            "error": "username must be at least 3 characters long"
        }) 
    }
    if ((password.length < 3) || (password === undefined)) {
        return response.status(400).json({
            "error": "password must be at least 3 characters long"
        }) 
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const result = await user.save()
    response.status(201).json(result)
})

module.exports = router