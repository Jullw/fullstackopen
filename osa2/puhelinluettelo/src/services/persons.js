import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

//https://lit-savannah-43015.herokuapp.com/api/persons

const getAll = () => {
    const request =  axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (personID) => {
    const request = axios.delete(`${baseUrl}/${personID}`)
    return request.then(response => response.data)
}

const replacePerson = (personID , modifiedPerson) => {
    const request = axios.put(`${baseUrl}/${personID}`, modifiedPerson)
    return request.then(response => response.data)
}
export default {getAll, create, deletePerson, replacePerson}