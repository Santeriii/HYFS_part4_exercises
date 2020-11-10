const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: "Ruokablogi",
    author: "Valtteri",
    url: "ruokablogi.tk",
    likes:3,
  },
  {
    title: "Foodblog",
    author: "Petteri",
    url: "foodblog.ru",
    likes:2,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
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

  expect(response.body).toHaveLength(initialBlogs.length + 1)
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

  expect(response.body[initialBlogs.length].likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})