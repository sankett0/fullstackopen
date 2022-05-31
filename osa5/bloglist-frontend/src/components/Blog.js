import { useState } from 'react'


const Blog = ({ blog, handleLike, handleDelete, user }) => {

  const [hidden, setHidden] = useState(true)

  return (
    <div className="blog" data-testid="blog">
      {blog.title} {blog.author}
      <button data-testid="viewbutton" onClick={() => setHidden(!hidden)}>{hidden ? 'view' : 'close'}</button>
      {
        hidden ? null
          :
          <div className="blogDetails">
            <br />
            {blog.url}
            <br />
            likes {blog.likes}
            <button data-testid="likebutton" onClick={() => handleLike(blog)} className="like">like</button>
            <br />
            {user.username === blog.user.username
              ? <button onClick={() => handleDelete(blog)}>delete</button>
              : null}
          </div>
      }
    </div>
  )
}

export default Blog