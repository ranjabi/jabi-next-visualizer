import fs from 'fs'
import cors from 'cors'
import { config } from './config'

const express = require('express')
const app = express()
const port = 3010

app.use(express.static(config.appPath))
app.use(cors());

app.get('/raw-file', (_req, res) => {
  res.status(200).send(fs.readFileSync(config.rawFileOutputPath))
})

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})