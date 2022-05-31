import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component tests', () => {

  const testBlog = {
    title: 'Blog for testing',
    author: 'Joku Testaaja',
    url: 'www.google.com',
    likes: 301,
    user: {
      username: 'Joku User'
    }
  }

  const user = {
    username: 'Joku User'
  }

  afterEach(cleanup)

  test('only title and author are shown by default', () => {
    const { getByTestId } = render(<Blog blog={testBlog} user={user} />)
    expect(getByTestId('blog')).toHaveTextContent('Blog for testing')
    expect(getByTestId('blog')).toHaveTextContent('Joku Testaaja')
    expect(getByTestId('blog')).not.toHaveTextContent('www.google.com')
    expect(getByTestId('blog')).not.toHaveTextContent('likes')
  })


  test('additional information is shown after clicking view button', async () => {
    const { getByTestId } = render(<Blog blog={testBlog} user={user} />)

    const u = userEvent.setup()
    const button = getByTestId('viewbutton')
    await u.click(button)
    expect(getByTestId('blog')).toHaveTextContent('www.google.com')
    expect(getByTestId('blog')).toHaveTextContent('likes 301')
  })

  test('event handler is called twice when like is pressed twice', async () => {
    const mockHandler = jest.fn()
    const { getByTestId } = render(<Blog blog={testBlog} user={user} handleLike={mockHandler}/>)

    const u = userEvent.setup()
    await u.click(getByTestId('viewbutton'))
    await u.click(getByTestId('likebutton'))
    await u.click(getByTestId('likebutton'))
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})