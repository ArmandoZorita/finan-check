<!-- ProfileView.vue -->

<script>
// # Profile component
import { userService } from '../services/userService.js'

export default {
  props: ['user'],
  emits: ['profile-updated'],
  data() {
    return {
      profile: { ...this.user }
    }
  },
  methods: {
    saveProfile() {
      userService.updateProfile(this.profile)
        .then((updated) => {
          alert('Profile updated!')
          this.$emit('profile-updated', updated)
        })
        .catch((err) => console.error(err))
    }
  }
}
</script>

<template>
  <div class="form-container">
    <h3>2.3 Edit Profile</h3>
    <form @submit.prevent="saveProfile">
      <div>
        <label>User ID:</label>
        <input type="text" v-model="profile.id" disabled>
      </div>
      <div>
        <label>Username:</label>
        <input type="text" v-model="profile.username" disabled>
      </div>
      <div>
        <label>Password Hash:</label>
        <input type="text" v-model="profile.passwordHash" required>
      </div>
      <div>
        <label>Profile Photo URL:</label>
        <input type="url" v-model="profile.profilePhoto" required>
      </div>
      <button type="submit">Update Profile</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 400px;
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
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
</style>