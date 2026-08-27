// server.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'public', 'users-db.json')
const TRANSACTIONS_DB_PATH = path.join(__dirname, 'public', 'transactions-db.json')

// POST endpoint to update public/users-db.json directly on disk
app.post('/api/save-users', (req, res) => {
  try {
    const data = { users: req.body }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
    res.json({ success: true, message: 'File written to disk successfully!' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// POST endpoint to update public/transactions-db.json on disk
app.post('/api/save-transactions', (req, res) => {
  try {
    fs.writeFileSync(TRANSACTIONS_DB_PATH, JSON.stringify({ transactions: req.body }, null, 2))
    res.json({ success: true, message: 'Transactions saved to disk!' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(3000, () => {
  console.log('Local persistence server running on http://localhost:3000')
})