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

// save/replace file contacts.json with new data
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// add new contact
const addContact = (contact) => {
  const contacts = loadContacts()
  contacts.push(contact)
  saveContacts(contacts)
}

// check data duplicate
const checkDuplicate = (nama) => {
  const contacts = loadContacts()
  return contacts.find((contact) => contact.nama === nama)
}

// delete contact
const deleteContacts = (nama) => {
  const contacts = loadContacts()
  const filterContacts = contacts.filter((contact) => contact.nama !== nama)
  saveContacts(filterContacts)
}

// update contact
const updateContact = (contactBaru) => {
  const contacts = loadContacts()
  const filterContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
  delete contactBaru.oldNama
  filterContacts.push(contactBaru)
  saveContacts(filterContacts)
}

module.exports = {
  loadContacts,
  findContact,
  addContact,
  checkDuplicate,
  deleteContacts,
  updateContact
}
