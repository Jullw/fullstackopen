import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Filter = ({ searchName, handleSearch }) => {
  return (
    <div>
      search: <input value={searchName} onChange={handleSearch}></input>
    </div>
  )
}


const Add = ({ addPerson, newNumber, newName, handleNameChange, handleNumberChange }) => {

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit"> add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, handleClick }) => {
  return (
    <div>
      {personsToShow.map((person) =>
        <Person key={person.name} person={person} handleClick={handleClick} />
      )}
    </div>
  )
}

const Person = ({ person, handleClick }) => {

  return (
    <div>
      <p> {person.name} {person.number} <DeletePersonButton handleClick={() => handleClick(person.id, person.name)} /></p>
    </div>
  )
}

const DeletePersonButton = ({ handleClick }) => <button onClick={handleClick}> Delete </button>




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')


  useEffect(() => {
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log(event.target)

    const newPerson = {
      name: newName,
      number: newNumber
    }

    persons.some(person => person.name.toLowerCase() === newName.toLowerCase()) ?
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        ? changeNumber() : console.log('')
      : personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (personID) => {
    personsService
      .deletePerson(personID)
      .then(
        setPersons(persons.filter(person => person.id !== personID))
      )
  }

  const changeNumber = () => {

    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())


    const changedPersonObject = { ...person, number: newNumber }

    personsService
      .replacePerson(changedPersonObject.id, changedPersonObject)
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.map(pe => pe.id === returnedPerson.id ? returnedPerson : pe))
      })

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchName(event.target.value)

  }

  const handleClick = (personID, personName) => {
    if (window.confirm(`Delete ${personName} ?`)) {
      deletePerson(personID)
    }


  }

  const personsToShow = false
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchName))


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearch={handleSearch} />

      <h2>Add</h2>
      <Add addPerson={addPerson} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleClick={handleClick} />
    </div>
  )
}

export default App;
