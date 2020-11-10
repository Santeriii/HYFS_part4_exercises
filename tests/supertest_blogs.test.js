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

afterAll(() => {
  mongoose.connection.close()
})