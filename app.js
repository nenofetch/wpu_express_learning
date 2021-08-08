const express = require('express')
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts')
// const morgan = require('morgan')
const { loadContacts, findContact, addContact, checkDuplicate } = require('./utils/contacts')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

// use ejs as template engine and use express-ejs-layouts for layouting
app.set('view engine', 'ejs')

// Third-Party Middleware
app.use(expressLayouts)
// app.use(morgan('dev'))

// Build-In Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

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
  const contacts = loadContacts()
  res.status(200).render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact Page',
    contacts,
    msg: req.flash('msg')
  })
})

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layout',
    title: 'Tambah Contact'
  })
})

app.post('/contact', [
  body('nama').custom((value) => {
    const duplicate = checkDuplicate(value)
    if (duplicate) {
      throw new Error('Nama kontak ini sudah tersimpan, silahkan gunakan nama lain!')
    }
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      layout: 'layouts/main-layout',
      title: 'Tambah Contact',
      errors: errors.array()
    })
  }
  addContact(req.body)
  req.flash('msg', 'Data contact berhasil ditambahkan!')
  res.redirect('/contact')
})

app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  res.status(200).render('detail', {
    layout: 'layouts/main-layout',
    title: 'Contact Detail',
    contact
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
