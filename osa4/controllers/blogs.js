const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getFromToken = request => {
  const authorization = request.get('authorization')  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    
    return authorization.substring(7)  
  }  
  return null
}

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.post('/', async (request, response) => {
  const body = request.body

  if (body.likes === undefined) {
    body.likes = 0
  }
  if (request.body.url === undefined) {
    return response.status(400).json({"error": "url must be given"})
  }
  if (request.body.title === undefined) {
    return response.status(400).json({"error": "title must be given"})
  }
  const token = getFromToken(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

router.delete('/:id', async (request, response) => {
  const result = await Blog.deleteOne({id: request.body.id})
  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const updatedLikes = request.body.likes
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, 
    { likes: updatedLikes }, 
    { new: true }
  )
  response.json(updatedBlog)
})

module.exports = router