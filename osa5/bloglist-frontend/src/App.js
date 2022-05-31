import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'


const Notification = ({ msg }) => {
  if (msg === null) {
    return null
  }

  return (
    <div className="notification">
      {msg}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  const setNotificationWithTimeout = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes ))
      )
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      blogService.getAll().then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes )))
      setNotificationWithTimeout('Login successful')
    } catch (err) {
      console.log(err)
      setNotificationWithTimeout('Login failed')
    }
    setUsername('')
    setPassword('')
  }

  const handleLogout = e => {
    e.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    setNotificationWithTimeout('Logged out')
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Do you want to delete ${blog.title}?`)) {
      return
    }
    try {
      blogService.deleteBlog(blog.id)
      setNotificationWithTimeout(`${blog.title} deleted!`)
      const newBlogs = blogs.filter(b => b.id !== blog.id)
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes ))
    } catch (err) {
      setNotificationWithTimeout(`Failed to delete ${blog.title}`)
      console.log(err)
    }
  }

  const handleLike = async (blog) => {
    try {
      const result = await blogService.like(blog)
      const newBlogs = blogs.map(b => b.id === blog.id ? { ...b, likes: result.likes } : b)
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes ))
    } catch (err) {
      setNotificationWithTimeout(`Failed to like ${blog.title}`)
      console.log(err)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <form onSubmit={handleLogin}>
          username
          <input onChange={e => setUsername(e.target.value)} value={username} className="username"/>
          <br />
          password
          <input onChange={e => setPassword(e.target.value)} value={password} type="password" className="password"/>
          <br />
          <input type="submit" value="login" className="loginbutton"/>
        </form>
      </div>
    )
  }

  const blogList = () => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        )}
      </div>
    )
  }
  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification msg={notification}/>
        {loginForm()}
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification msg={notification}/>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
        <br/><br/>
        <Togglable buttonLabel="new note">
          <NewBlogForm
            setBlogs={setBlogs}
            setNotificationWithTimeout={setNotificationWithTimeout}
          />
        </Togglable>
        <br/>
        {blogList()}
      </div>
    )
  }
}

export default App
