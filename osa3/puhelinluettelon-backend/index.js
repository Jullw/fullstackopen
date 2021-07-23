require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/mongo')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())
app.use(express.static('build'))


/*
let persons = [
    {
        id: 1,
        name: "Pekka Puulainen",
        number: "0432432404"
    },
    {
        id: 2,
        name: "Maija Maalainen",
        number: "0446849368"
    },
    {
        id: 3,
        name: "Matti Meikalainen",
        number: "090034248"
    },
]
*/



/*
app.get('/api/persons', (req, res) => {
    res.json(persons)
}) */

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).send('error 404 not found').end()
            }
        })
        .catch(error => next(error))
    /*   const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }  */
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const infoText = `<p> Phonebook has info for ${persons.length}</p> 
        <p> ${new Date()} </p>`;
        response.send(infoText)
    }).catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
   /* const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end() */
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

})

/*
const generateID = () => {
    const randomID = Math.floor(Math.random() * 1000000) + 1;
    return randomID;
}
*/
app.post('/api/persons', (request, response, next) => {

    const body = request.body
    
    /*
    if (!body.name) {
        return response.status(400).json({
            error: "Name missing"
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: "Number missing"
        })
    }

    if(persons.some(p => p.name === body.name)){
        return response.status(400).json({
            error: "name must be unique" 
        }) 
    } */

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    //persons = persons.concat(person)
    person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name : body.name,
      number : body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.error(error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id!!' })
    }else if(error.name === 'ValidationError'){ // Jos POST vaiheessa ei ole uniikki nimi niin tämä lauseke käynnistyy.
        return response.status(400).json({ error : error.message})
    }
    next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is runnign  ${PORT}`)
})
