const fs = require('fs')

// create directory

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath)
}

// create contacts.json if not existed
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// fetch all from contacts.json
const loadContacts = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
  const contacts = JSON.parse(fileBuffer)
  return contacts
}

// search contact using name
const findContact = (nama) => {
  const contacts = loadContacts()
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
  return contact
}

module.exports = {
  loadContacts,
  findContact
}
