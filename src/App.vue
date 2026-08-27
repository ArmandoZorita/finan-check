<!-- App.vue -->

<script>
// # Root component
import LoginView from './components/LoginView.vue'
import MenuView from './components/MenuView.vue'
import { userService } from './services/userService.js'

export default {
  components: {
    LoginView,
    MenuView
  },
  data() {
    return {
      currentUser: null
    }
  },
  mounted() {
    this.currentUser = userService.getCurrentUser()
  },
  methods: {
    handleLoginSuccess(user) {
      this.currentUser = user
    },
    handleLogout() {
      userService.logout().then(() => {
        this.currentUser = null
      })
    },
    handleUserChanged(updatedUser) {
      this.currentUser = { ...updatedUser }
    }
  }
}
</script>

<template>
  <div>
    <LoginView v-if="!currentUser" @login-success="handleLoginSuccess" />
    <MenuView v-else :user="currentUser" @logout="handleLogout" @user-changed="handleUserChanged" />
  </div>
</template>

<style scoped>
div {
  font-family: sans-serif;
  padding: 20px;
}
</style>