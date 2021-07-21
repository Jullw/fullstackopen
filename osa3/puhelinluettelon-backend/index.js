const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())


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



app.get('/', (req, res) => {
    res.send('<h1> Starting site </h1>')

})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const infoText = `<p> Phonebook has info for ${persons.length}</p> 
    <p> ${new Date()} </p>`;
    res.send(infoText)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateID = () => {
    const randomID = Math.floor(Math.random() * 1000000) + 1;
    return randomID;
}

app.post('/api/persons', (request, response) => {

    const body = request.body
    
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
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is runnign  ${PORT}`)
})
