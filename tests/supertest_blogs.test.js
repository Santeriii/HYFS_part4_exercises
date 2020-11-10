const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have a field called "id" for identification', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(blog => blog.id)
  expect(contents[0]).toBeDefined();
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Ruokablog",
    author: "Valtter",
    url: "ruokablogi.t",
    likes:5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(
    'Ruokablog'
  )
})

test('if field "likes" has not been given a value, its" value is set to "0"', async () => {
  const newBlog = {
    title: "Ruokablog",
    author: "Valtter",
    url: "ruokablogi.t",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[helper.initialBlogs.length].likes).toBe(0)
})

test('if fields "title" and "url" have not been given, a status "400, bad request" is given', async () => {
  const newBlog = {
    author: "Valtter",
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be modified', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]

  const newBlog = {
    title: "Ruokablogi",
    author: "Valtteri",
    url: "ruokablogi.tk",
    likes: 10,
  }

  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].likes).toBe(10)
})

afterAll(() => {
  mongoose.connection.close()
})