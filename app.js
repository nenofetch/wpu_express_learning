const express = require('express')
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')

// use ejs as template engine and use express-ejs-layouts for layouting
app.set('view engine', 'ejs')

// Third-Party Middleware
app.use(expressLayouts)
app.use(morgan('dev'))

// Build-In Middleware
app.use(express.static('public'))

// Application middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.get('/', (req, res) => {
  const barang = [{
    nama: 'Nike Jordan',
    price: '$80'
  },
  {
    nama: 'Nike x Dior',
    price: '$500'
  }]
  res.status(200).render('index', {
    layout: 'layouts/main-layout',
    nama: 'Neno Arisma',
    title: 'Homepage',
    barang
  })
})

app.get('/about', (req, res) => {
  res.status(200).render('about', {
    layout: 'layouts/main-layout',
    title: 'About Page'
  })
})

app.get('/contact', (req, res) => {
  res.status(200).render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact Page'
  })
})

app.get('/product/:id', (req, res) => {
  res.send(`ID produk anda adalah: ${req.params.id} <br> dengan kategori ${req.query.category}`)
})

app.use((req, res) => {
  res.status(404).render('error', {
    layout: 'layouts/main-layout',
    title: 'Upppss'
  })
})

app.listen(port, () => {
  console.log(`Example server run on localhost:${port}`)
})
