import { useState } from 'react'
import blogService from '../services/blogs'


const NewBlogForm = (props) =>  {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (e) => {
    e.preventDefault()
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url
      })
      props.setBlogs(oldBlogs => [...oldBlogs, newBlog].sort((a, b) => b.likes - a.likes ))
      props.setNotificationWithTimeout('New blog created')
    } catch (err) {
      props.setNotificationWithTimeout('Blog creation failed')
      console.log(err)
    }
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleNewBlog}>
      title
      <input onChange={e => setTitle(e.target.value)} value={title} type="text" className="title"/>
      <br />
      author <input onChange={e => setAuthor(e.target.value)} value={author} type="text" className="author"/>
      <br />
      url <input onChange={e => setUrl(e.target.value)} value={url} type="text" className="url"/>
      <br />
      <input type="submit" value="create" className="createbutton"/>
    </form>
  )
}

export default NewBlogForm