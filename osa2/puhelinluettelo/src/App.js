import React, {useState, useEffect} from 'react'
import axios from 'axios'


const Filter = ({searchName, handleSearch}) =>{
  return(
    <div>
    search: <input value={searchName} onChange={handleSearch}></input>
    </div>
  )
}


const Add =({addPerson,newNumber,newName,handleNameChange,handleNumberChange})=>{

  return(
  <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit"> add</button>
      </div>
    </form>
  )
}

const Persons =({personsToShow}) =>{
  return(
  <div>
    {personsToShow.map((person, i) => 
      <p key={person.name, i}>{person.name} {person.number}</p>
      )}
  </div>
  )
}
/* const [ persons, setPersons] = useState([
  {name: 'Matti Leppälä', number: '+3584456739'}
]) */
const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchName, setSearchName] = useState('')


  useEffect(() => {
    console.log('Efectin sisalla')
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  },[])

  const addPerson = (event) =>{
    event.preventDefault()
    console.log(event.target)

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1 
    }
    
    persons.some(person => person.name.toLowerCase() === newName.toLowerCase()) ?
    window.alert(`${newName} is already added to phonebook`): 
    setPersons(persons.concat(newPerson))

    setNewName('')
    setNewNumber('')
    
  } 

  const handleNameChange = (event) =>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) =>{
    setSearchName(event.target.value)

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
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App;
