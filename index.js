// import dotenv and call config function to load environment
require('dotenv').config()
const express = require('express')

// Get routes to the variabel
const router = require('./src/routes')

const app = express()

const port = 5000

app.use(express.json())


app.use('/api/v1/', router)

app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Listening on port ${port}!`))