const mongoose = require('mongoose')

if (process.argv[2].length < 3) {
    console.log('Give a password')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://JaaJuu:${password}@clusterduck.mij1o.mongodb.net/phonebookDB?retryWrites=true&w=majority`

const name = process.argv[3]
const number = process.argv[4]

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(response => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })

} else {
    console.log('phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}


