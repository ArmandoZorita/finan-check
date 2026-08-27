<!-- LoginView.vue -->

<script>
// # Login and Register component
import { userService } from '../services/userService.js'

export default {
  emits: ['login-success'],
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showRegisterForm: false,
      newUsername: '',
      newPassword: '',
      newPhoto: '',
      registerSuccessMsg: ''
    }
  },
  methods: {
    handleLogin() {
      this.error = ''
      userService.login(this.username, this.password)
        .then((user) => {
          this.$emit('login-success', user)
        })
        .catch((err) => {
          this.error = err.message || 'Login failed'
        })
    },
    handleRegister() {
      this.error = ''
      this.registerSuccessMsg = ''
      const newUser = {
        username: this.newUsername,
        passwordHash: this.newPassword,
        profilePhoto: this.newPhoto
      }
      userService.addUser(newUser)
        .then((user) => {
          this.registerSuccessMsg = `User ${user.username} created successfully! You can now log in.`
          this.newUsername = ''
          this.newPassword = ''
          this.showRegisterForm = false
        })
        .catch((err) => {
          this.error = err.message || 'Failed to register user'
        })
    }
  }
}
</script>

<template>
  <div class="card">
    <h2>Financial Tracker Login</h2>

    <!-- Hidden trigger button as requested -->
    <button style="display: none;" id="hidden-register-btn" @click="showRegisterForm = !showRegisterForm">
      Toggle Register Form
    </button>

    <!-- Login Form -->
    <form v-if="!showRegisterForm" @submit.prevent="handleLogin">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" required>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Log In</button>
      <button type="button" class="link-btn" @click="showRegisterForm = true">Create new account</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="registerSuccessMsg" class="success">{{ registerSuccessMsg }}</p>
    </form>

    <!-- Add User / Register Form -->
    <form v-else @submit.prevent="handleRegister" class="register-form">
      <h3>Add New User</h3>
      <div>
        <label>New Username:</label>
        <input type="text" v-model="newUsername" required>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="newPassword" required>
      </div>
      <div>
        <label>Profile Photo URL:</label>
        <input type="url" v-model="newPhoto" >
      </div>
      <button type="submit" class="submit-register">Register User</button>
      <button type="button" class="link-btn" @click="showRegisterForm = false">Back to Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.card {
  max-width: 350px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
div {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  cursor: pointer;
  margin-top: 5px;
}
.link-btn {
  background: transparent;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
}
.submit-register {
  background: #28a745;
  color: white;
  border: none;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>