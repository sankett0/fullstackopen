import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = tok => {
  token = `bearer ${tok}`
}

const create = async obj => {
  const result = await axios.post(
    baseUrl,
    obj,
    {
      headers: { Authorization: token }
    }
  )
  return result.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const like = async (blog) => {
  const res = await axios.put(`${baseUrl}/${blog.id}`, {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
  })
  return res.data
}

const deleteBlog = async (id) => {
  const result = await axios.delete(`${baseUrl}/${id}`)
  return result
}

export default { setToken, create, getAll, like, deleteBlog }