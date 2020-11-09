const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
      let total = 0
      blogs.map(blog => total += blog.likes)

      return total
  }

  const favoriteBlog = (blogs) => {
    let favorite = ''
    blogs.map(blog => {
      if (favorite == '') {
        favorite = blog
      } else if (favorite.likes < blog.likes) {
        favorite = blog
      }
    })

    return favorite
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }