const Blog = require('../models/blog')
const User = require('../models/user')

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}