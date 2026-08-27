<!-- AddTransactionView.vue -->

<script>
// # Add Transaction component
import { transactionService } from '../services/transactionService.js'

export default {
  props: ['user'],
  emits: ['transaction-added'],
  data() {
    return {
      bank: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Groceries',
      description: '',
      importAmount: 0
    }
  },
  methods: {
    submitForm() {
      const record = {
        user_id: this.user.id,
        bank: this.bank,
        date: this.date,
        category: this.category,
        description: this.description,
        import: this.importAmount
      }

      transactionService.addTransaction(record)
        .then(() => {
          this.$emit('transaction-added')
        })
        .catch((err) => console.error(err))
    }
  }
}
</script>

<template>
  <div class="form-container">
    <h3>2.2 Add New Transaction</h3>
    <form @submit.prevent="submitForm">
      <div>
        <label>User ID:</label>
        <input type="text" :value="user.id" disabled>
      </div>
      <div>
        <label>Bank:</label>
        <input type="text" v-model="bank" placeholder="e.g. Revolut" required>
      </div>
      <div>
        <label>Date:</label>
        <input type="date" v-model="date" required>
      </div>
      <div>
        <label>Category:</label>
        <select v-model="category" required>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Salary">Salary</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>
      <div>
        <label>Description:</label>
        <input type="text" v-model="description" required>
      </div>
      <div>
        <label>Import (+ income, - expense):</label>
        <input type="number" step="0.01" v-model.number="importAmount" required>
      </div>
      <button type="submit">Save Transaction</button>
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
input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>