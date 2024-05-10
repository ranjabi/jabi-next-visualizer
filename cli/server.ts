import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { config } from './config'

const express = require('express')
const app = express()
const port = 3010

// const appPath = path.join(__dirname, '..', 'app', 'out')

// app.use(express.static(appPath))
app.use(express.static(config.appPath))
app.use(cors());

app.get('/raw-file', (req, res) => {
  // res.status(200).send(fs.readFileSync('/Users/ranjabi/Desktop/Coding/jabi-next-visualizer/app/.visualizer/data.json'))
  res.status(200).send(fs.readFileSync(config.rawFileOutputPath))
})

app.get('/', (req, res) => {
  // const indexPath = path.join(__dirname, '..', 'app', 'out', 'index.html')
  // console.log('dirname:', indexPath)
  // res.sendFile(indexPath);
  res.sendFile(config.appIndexPath);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})