const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

const testBlogs = [
    {
        title: "Testiblogi",
        author: "Pekka",
        url: "www.google.com",
        likes: 535
    },
    {
        title: "Jokublogi",
        author: "Joku",
        url: "yle.fi"
    },
]

describe('blogs API', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        let testBlog = new Blog(testBlogs[0])
        await testBlog.save()
        testBlog = new Blog(testBlogs[1])
        await testBlog.save()
    })

    test('blogs are returned in JSON format', async () => {
        const result = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toHaveLength(testBlogs.length)
    })

    test('identifier of blog is id', async () => {
        const result = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const ids = result.body.map(blog => blog.id)
        expect(ids[0]).toBeDefined()
        expect(ids[1]).toBeDefined()
    })

    test('new blog can be created', async () => {
        const blog = {
            title: "This is a completely new blog",
            author: "Joku Asd",
            url: "noaddress",
            likes: 304
        }
        await api.post('/api/blogs')
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const result = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body).toHaveLength(testBlogs.length + 1)
        expect(result.body[2].title).toBe("This is a completely new blog")
    })

    
    test('if no value is given for likes, it is set to zero', async () => {
        const blog = {
            title: "This is a completely new blog",
            author: "Joku Asd",
            url: "noaddress"
        }
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDb = await testHelper.blogsInDb()  
        expect(blogsInDb[2].likes).toBe(0)
    })
    
    test('if new blog contains no title, it should not be created', async () => {
        const blog = {
            author: "Testii Testi",
            url: "asdasd",
            likes: 100
        }
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)

        const blogsInDb = await testHelper.blogsInDb()
        expect(blogsInDb).toHaveLength(testBlogs.length)
    })    

    test('if new blog contains no url, it should not be created', async () => {
        const blog = {
            title: "Random title",
            author: "Testii Testi",
            likes: 100
        }
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)

        const blogsInDb = await testHelper.blogsInDb()
        expect(blogsInDb).toHaveLength(testBlogs.length)
    })

    test('single blog can be deleted', async () => {
        const allblogsfirst = await api.get('/api/blogs')
        const id = allblogsfirst.body[0].id
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
        const allblogsnow = await api.get('/api/blogs')
        expect(allblogsnow.body).toHaveLength(1)    
    })
    
    test('blog likes can be updated', async () => {
        const allblogsfirst = await api.get('/api/blogs')
        const initialLikes = allblogsfirst.body[0].likes
        const id = allblogsfirst.body[0].id
        await api
            .put(`/api/blogs/${id}`)
            .send({likes: initialLikes + 1})
            .expect(200)
        const allblogsnow = await api.get('/api/blogs')
        expect(allblogsnow.body[0].likes).toBe(initialLikes + 1)
    })
})