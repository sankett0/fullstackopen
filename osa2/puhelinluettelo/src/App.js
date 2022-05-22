import { useState, useEffect } from 'react'
import contactService from './services/contacts'

const Filter = props => {
  return (
    <p>filter shown with <input onChange={props.onChange} /></p>
  )
}

const NewContact = props => {
  return (
    <div>
      name: <input onChange={props.setNewName} value={props.newName}/>
      <br />
      number: <input onChange={props.setNewPhone} value={props.newPhone}/>
      <button onClick={props.handleSubmit} type="submit">add</button>
    </div>
  )
}

const Contact = props => (
  <h4>
    {props.name} {props.phone} <button onClick={() => props.handleDelete(props.id)}>delete</button>
  </h4>
)

const ContactList = props => {
  return props.contacts.map((person, idx) => (
    <Contact 
      name={person.name} 
      phone={person.number} 
      id={person.id} 
      key={idx} 
      handleDelete={props.handleDelete}/>
  ))
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchedContact, setSearchedContact] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
      contactService.getAllContacts() 
      .then(res => setPersons(res.data))
  }, [])

  const handleSubmit = e => {
    const alreadyContains = persons.find(person => person.name === newName || person.phone === newPhone)
    if (alreadyContains) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const copyPersons = persons
      contactService.addContact(newName, newPhone)
      .then(res => {
        copyPersons.push(res.data)
        setPersons(copyPersons)
        setNotification(`Successfully added ${newName}`)
        setTimeout(() => setNotification(null), 5000)
      })
    }
    setNewName('')
    setNewPhone('')
    e.preventDefault()
  }

  const handleDelete = id => {
    if (!window.confirm("Do you really want to delete the contact?")) {
      return
    }
    const filtered = persons.filter((person, idx) => person.id !== id)
    contactService.deleteContact(id)
    .then((res) => {
      setPersons(filtered)
      setNotification('Successfully deleted user')
      setTimeout(() => setNotification(null), 5000)
    })
  }

  const contactsToShow = searchedContact === '' ? persons : persons.filter(person => 
      person.name.toLowerCase().includes(searchedContact.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter onChange={e => setSearchedContact(e.target.value)}/>
      <h3>add a new</h3>
      <form>
        <NewContact 
          setNewName={e => setNewName(e.target.value)}
          setNewPhone={e => setNewPhone(e.target.value)}
          newName={newName}
          newPhone={newPhone}
          handleSubmit={handleSubmit}
        />
      </form>
      <h2>Numbers</h2>
      <ContactList contacts={contactsToShow} handleDelete={handleDelete}/>
    </div>
  )

}

export default App