import express, {Express, Request, Response} from 'express'
const app: Express = express()

// Import CORS
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts'
import { body, validationResult, check } from 'express-validator'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'

// importing my utils
import { loadContacts, findContact, addContact, checkDuplicate, deleteContacts, updateContact } from './utils/contacts'

app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash(), cors())

// use ejs as template engine and use express-ejs-layouts for layouting
app.set('view engine', 'ejs')

// Third-Party Middleware
app.use(expressLayouts)
// app.use(morgan('dev'))

// Build-In Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
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

app.get('/about', (req: Request, res) => {
  res.status(200).render('about', {
    layout: 'layouts/main-layout',
    title: 'About Page'
  })
})

app.get('/contact', (req: Request, res) => {
  const contacts = loadContacts()
  res.status(200).render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact Page',
    contacts,
    msg: req.flash('msg')
  })
})

app.get('/contact/add', (req: Request, res) => {
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
    return true
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak valid').isMobilePhone('id-ID')
], (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      layout: 'layouts/main-layout',
      title: 'Tambah Contact',
      errors: errors.array()
    })
  } else {
    addContact(req.body)
    req.flash('msg', 'Data contact berhasil ditambahkan!')
    res.redirect('/contact')
  }
})

app.get('/contact/delete/:nama', (req: Request, res: Response) => {
  const contact = findContact(req.params.nama)

  if (!contact) {
    res.status(404).send('<h1>Nama kontak tidak ada</h1>')
  } else {
    deleteContacts(req.params.nama)
    req.flash('msg', 'Data contact berhasil dihapus!')
    res.redirect('/contact')
  }
})

app.get('/contact/edit/:nama', (req: Request, res: Response) => {
  const contact = findContact(req.params.nama)

  res.render('edit-contact', {
    layout: 'layouts/main-layout',
    title: 'Form Ubah Contact',
    contact
  })
})

app.post('/contact/update', [
  body('nama').custom((value, { req }) => {
    const duplicate = checkDuplicate(value)
    if (value !== req.body.oldNama && duplicate) {
      throw new Error('Nama kontak ini sudah tersimpan, silahkan gunakan nama lain!')
    }
    return true
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak valid').isMobilePhone('id-ID')
], (req:Request, res:Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      layout: 'layouts/main-layout',
      title: 'Form Ubah Data Contact',
      errors: errors.array(),
      contact: req.body
    })
  } else {
    updateContact(req.body)
    req.flash('msg', 'Data contact berhasil diubah!')
    res.redirect('/contact')
  }
})

app.get('/contact/:nama', (req: Request, res: Response) => {
  const contact = findContact(req.params.nama)

  res.status(200).render('detail', {
    layout: 'layouts/main-layout',
    title: 'Contact Detail',
    contact
  })
})

app.get('/product/:id', (req:Request, res: Response) => {
  res.send(`ID produk anda adalah: ${req.params.id} <br> dengan kategori ${req.query.category}`)
})

app.use((req: Request, res: Response) => {
  res.status(404).render('error', {
    layout: 'layouts/main-layout',
    title: 'Upppss'
  })
})

app.listen(8080, () => {
  console.log(`Web server was running on port 8080`)
})
