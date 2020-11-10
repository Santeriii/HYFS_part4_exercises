const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
    })

    try {
      if (blog.title && blog.url) {
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
      } else {
        response.status(400).end()
      }
    } catch(exception) {
      next(exception)
    }
  })

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
  }

  try {
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter