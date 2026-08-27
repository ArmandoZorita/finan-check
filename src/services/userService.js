function hashPassword(password) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
    .then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''))
}
function saveToGitHub(jsonArray) {
  const token = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN'
  const repo = 'your-username/your-repo-name'
  const path = 'public/users-db.json'

  // 1. Get the current file's SHA hash (required by GitHub API to update files)
  return fetch(`https://api.github.com/repos/${repo}/contents/${path}`)
    .then((res) => res.json())
    .then((fileData) => {
      // 2. Send PUT request to update the file in the repository
      return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update users-db.json via app',
          content: btoa(JSON.stringify({ users: jsonArray }, null, 2)), // Base64 encode
          sha: fileData.sha
        })
      })
    })
}
// OPTION 1: Save directly to GitHub repo via GitHub REST API (for GitHub Pages)
function saveToGitHub(usersArray) {
  const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN' // Insert Token Here
  const REPO = 'your-username/your-repo-name'                // Insert repo here
  const FILE_PATH = 'public/users-db.json'
  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

  return fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  })
    .then((res) => res.json())
    .then((fileData) => {
      const content = btoa(JSON.stringify({ users: usersArray }, null, 2))
      return fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update users-db.json via app register',
          content: content,
          sha: fileData.sha
        })
      })
    })
    .then((res) => res.json())
}

// OPTION 3: Save to local public/users-db.json via Node server.js
function saveToLocalServer(usersArray) {
  return fetch('http://localhost:3000/api/save-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usersArray)
  }).then((res) => res.json())
}

export const userService = {
  login(username, password) {
    return hashPassword(password).then((inputHash) => {
      return fetch('/users-db.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch user database')
          return res.json()
        })
        .then((data) => {
          const stored = localStorage.getItem('users_db')
          const users = stored ? JSON.parse(stored) : data.users
          //const found = users.find((u) => u.username === username && (u.pwd === inputHash || u.passwordHash === inputHash))
          const found = users.find((u) => u.username === username && (u.pwd === password || u.passwordHash === password))
          if (!found) throw new Error('Invalid credentials')
          localStorage.setItem('active_user', JSON.stringify(found))
          return found
        })
    })
  },

  addUser(newUser) {
    return hashPassword(newUser.password).then((pwdHash) => {
      return fetch('/users-db.json')
        .then((res) => res.json())
        .then((data) => {
          const stored = localStorage.getItem('users_db')
          const users = stored ? JSON.parse(stored) : data.users
          const exists = users.some((u) => u.username === newUser.username)
          if (exists) throw new Error('Username already exists')
          
          const userRecord = {
            id: `usr_${Date.now().toString().slice(-4)}`,
            username: newUser.username,
            pwd: newUser.password, /**pwd: pwdHash, */
            profilePhoto: newUser.profilePhoto
          }
          users.push(userRecord)
          localStorage.setItem('users_db', JSON.stringify(users))
          return userRecord
        })
    })
  },

  getCurrentUser() {
    const session = localStorage.getItem('active_user')
    return session ? JSON.parse(session) : null
  },

  updateProfile(updatedUser) {
    return fetch('/users-db.json')
      .then((res) => res.json())
      .then((data) => {
        const stored = localStorage.getItem('users_db')
        const users = stored ? JSON.parse(stored) : data.users
        const index = users.findIndex((u) => u.id === updatedUser.id)
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedUser }
          localStorage.setItem('users_db', JSON.stringify(users))
          localStorage.setItem('active_user', JSON.stringify(users[index]))
        }
        return updatedUser
      })
  },

  logout() {
    localStorage.removeItem('active_user')
    return Promise.resolve(true)
  }
}