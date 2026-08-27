<!-- MenuView.vue -->

<script>
// # Menu wrapper component
import TransactionsSummaryView from './TransactionsSummaryView.vue'
import AddTransactionView from './AddTransactionView.vue'
import ProfileView from './ProfileView.vue'

export default {
  components: {
    TransactionsSummaryView,
    AddTransactionView,
    ProfileView
  },
  props: ['user'],
  emits: ['logout', 'user-changed'],
  data() {
    return {
      currentTab: 'summary'
    }
  },
  methods: {
    onTransactionAdded() {
      this.currentTab = 'summary'
    },
    onProfileUpdated(updatedUser) {
      this.$emit('user-changed', updatedUser)
    }
  }
}
</script>

<template>
  <div>
    <header class="navbar">
      <div class="user">
        <img :src="user.profilePhoto" alt="Avatar">
        <span>Welcome, <strong>{{ user.username }}</strong></span>
      </div>

      <nav>
        <button @click="currentTab = 'summary'" :class="{ active: currentTab === 'summary' }">2.1 Summary</button>
        <button @click="currentTab = 'add'" :class="{ active: currentTab === 'add' }">2.2 Add Entry</button>
        <button @click="currentTab = 'profile'" :class="{ active: currentTab === 'profile' }">2.3 Profile</button>
      </nav>

      <button @click="$emit('logout')" class="logout">3) Logout</button>
    </header>

    <main class="content">
      <TransactionsSummaryView v-if="currentTab === 'summary'" :user="user" />
      <AddTransactionView v-if="currentTab === 'add'" :user="user" @transaction-added="onTransactionAdded" />
      <ProfileView v-if="currentTab === 'profile'" :user="user" @profile-updated="onProfileUpdated" />
    </main>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #ddd;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
nav {
  display: flex;
  gap: 10px;
}
nav button {
  padding: 8px 12px;
  cursor: pointer;
  background: #f0f0f0;
  border: 1px solid #ccc;
}
nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
.logout {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}
.content {
  margin-top: 20px;
}
</style>