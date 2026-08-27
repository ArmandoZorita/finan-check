// OPTION 1: Save directly to GitHub repo via GitHub REST API (for GitHub Pages)
function saveToGitHub(transactionsArray) {
  const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN' // Insert Token Here
  const REPO = 'your-username/your-repo-name'                // Insert repo here
  const FILE_PATH = 'public/transactions-db.json'
  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

  return fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  })
    .then((res) => res.json())
    .then((fileData) => {
      const content = btoa(JSON.stringify({ transactions: transactionsArray }, null, 2))
      return fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update transactions-db.json via app',
          content: content,
          sha: fileData.sha
        })
      })
    })
    .then((res) => res.json())
}

// OPTION 3: Save to local public/transactions-db.json via Node server.js
function saveToLocalServer(transactionsArray) {
  return fetch('http://localhost:3000/api/save-transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionsArray)
  }).then((res) => res.json())
}

// Helper to get transaction array from localStorage or JSON
function getTransactionsList() {
  const stored = localStorage.getItem('transactions_db')
  if (stored) {
    return Promise.resolve(JSON.parse(stored))
  }
  return fetch('/transactions-db.json')
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem('transactions_db', JSON.stringify(data.transactions))
      return data.transactions
    })
}

export const transactionService = {
  getTransactions(userId) {
    return fetch('/transactions-db.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch transactions database')
        return res.json()
      })
      .then((data) => {
        const stored = localStorage.getItem('transactions_db')
        const all = stored ? JSON.parse(stored) : data.transactions
        return all.filter((item) => item.user_id === userId)
      })
  },

  addTransaction(newRecord) {
    return fetch('/transactions-db.json')
      .then((res) => res.json())
      .then((data) => {
        const stored = localStorage.getItem('transactions_db')
        const list = stored ? JSON.parse(stored) : data.transactions
        const record = { ...newRecord, id: Date.now() }
        list.push(record)
        localStorage.setItem('transactions_db', JSON.stringify(list))
        return record
      })
  }
}