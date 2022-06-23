const mongoose = require('mongoose')

const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env

const conectionString = NODE_ENV === 'test'
  ? DB_URI_TEST
  : DB_URI

mongoose.connect(conectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('connected to MongoDB')
  }).catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })
