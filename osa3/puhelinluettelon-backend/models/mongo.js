const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

//mongodb+srv://JaaJuu:penetele@clusterduck.mij1o.mongodb.net/phonebookDB?retryWrites=true&w=majority 

console.log('Connecting to ', url)


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result =>{
    console.log('Connected to MongoDB, yaas')
})
.catch(error =>{
    console.log('error occured, can not connect to MongoDB', error.message)
}) 


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Person', personSchema)
