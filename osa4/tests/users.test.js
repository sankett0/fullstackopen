const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
    
    test('user creation with valid details', async () => {
        await api
            .post('/api/users')
            .send({
                username: "asdasdasd",
                name: "Asd Asd",
                password: "mypassword"
            })
            .expect(201)
    })

    test('username too short', async () => {
        const result = await api
                .post('/api/users')
                .send({
                    username: "aa",
                    name: "Asd Asd",
                    password: "mypassword"
                })
                .expect(400)
                .expect('Content-Type', /application\/json/)
                
        expect(result.body.error).toBe("username must be at least 3 characters long")
    })
    
    test('password too short', async () => {
        const result = await api
                .post('/api/users')
                .send({
                    username: "asdasdasd",
                    name: "Asd Asd",
                    password: "aa"
                })
                .expect(400)
                .expect('Content-Type', /application\/json/)
                
        expect(result.body.error).toBe("password must be at least 3 characters long")
    })

    test('user with the same name already exsits', async () => {
        await api
            .post('/api/users')
            .send({
                username: "asdasdasd",
                name: "Asd Asd",
                password: "mypassword"
            })
        await api
            .post('/api/users')
            .send({
                username: "asdasdasd",
                name: "Asd Asd",
                password: "mypassword"
            })
            .expect(400)        
    })
})