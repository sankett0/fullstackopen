import axios from 'axios'

const getAllContacts = () => {
    return axios.get("http://localhost:3001/persons")
}

const addContact = (name, number) => {
    return axios.post('http://localhost:3001/persons', {
        name: name,
        number: number
    })
}

const deleteContact = (id) => {
    return axios.delete(`http://localhost:3001/persons/${id}`)
}

export default { getAllContacts, addContact, deleteContact }