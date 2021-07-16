import React, { useState, useEffect } from 'react'
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

// delete Notification

// add Notification

// replace Notification

// alreadyDeleted

const ErrorNotification = ({ text }) => {
  return (
    <div className='error'>
      <h2> {text} </h2>
    </div>
  )
}

const SuccesNotification = ({ text }) => {
  return (
    <div className='success'>
      <h2> {text} </h2>
    </div>
  )
}

const NotificationHandler = ({ type, text }) => {

  if (type === 'success') {
    return (
      <SuccesNotification text={text} />
    )
  } else if (type === 'error') {
    return (
      <ErrorNotification text={text} />
    )
  } else {
    return null
  }
}





const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  // Text määrittelee tekstin ilmoitukselle.
  // Type määrittelee minkä tyyppinen ilmoitus on eli add,replace,delete
  const [text, setText] = useState('')
  const [type, setType] = useState('')


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

    if (newName.length > 0) {

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
            setText(`Added ${returnedPerson.name}`)
            setType('success')
          })
      setNewName('')
      setNewNumber('')
    }
  }


  const deleteContact = (personID) => {

    const pe = persons.find(p => p.id === personID)

    personsService
      .deletePerson(personID)
      .then(() => {
        setPersons(persons.filter(person => person.id !== personID))
        setType('success')
        setText(`Successfully deleted ${pe.name}`)
      }
    )
  }

  const changeNumber = () => {

    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    const changedPersonObject = { ...person, number: newNumber }

    personsService
      .replacePerson(changedPersonObject.id, changedPersonObject)
      .then(returnedPerson => {
        setType('success')
        setText(`Successfully replaced ${returnedPerson.name}`)
        setPersons(persons.map(pe => pe.id === returnedPerson.id ? returnedPerson : pe))
      }).catch(error => {
        setType('error')
        setText(`the contact '${person.name}' was already deleted from server`)
        setPersons(persons.filter(p => p.id !== person.id))
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
      deleteContact(personID)
    }
  }

  const personsToShow = false
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchName))


  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationHandler type={type} text={text} />
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
