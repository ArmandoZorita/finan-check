<!-- TransactionsSummaryView.vue -->

<script>
// # Transactions Summary component
import { transactionService } from '../services/transactionService.js'

export default {
  props: ['user'],
  data() {
    return {
      transactions: [],
      searchQuery: ''
    }
  },
  computed: {
    filteredTransactions() {
      const q = this.searchQuery.toLowerCase()
      return this.transactions.filter((t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.bank.toLowerCase().includes(q)
      )
    },
    totalIncome() {
      return this.transactions
        .filter((t) => t.import > 0)
        .reduce((sum, t) => sum + t.import, 0)
    },
    totalExpenses() {
      return this.transactions
        .filter((t) => t.import < 0)
        .reduce((sum, t) => sum + t.import, 0)
    },
    netBalance() {
      return this.totalIncome + this.totalExpenses
    }
  },
  mounted() {
    if (this.user) {
      transactionService.getTransactions(this.user.id)
        .then((data) => {
          this.transactions = data
        })
        .catch((err) => console.error(err))
    }
  }
}
</script>

<template>
  <div>
    <h3>2.1 Transactions & Summary</h3>

    <div class="summary-cards">
      <div class="card income">Income: <strong>+{{ totalIncome.toFixed(2) }}</strong></div>
      <div class="card expense">Expenses: <strong>{{ totalExpenses.toFixed(2) }}</strong></div>
      <div class="card balance">Net Balance: <strong>{{ netBalance.toFixed(2) }}</strong></div>
    </div>

    <input type="text" v-model="searchQuery" placeholder="Search expenses..." class="search">

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Bank</th>
          <th>Category</th>
          <th>Description</th>
          <th>Import Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredTransactions" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.bank }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.description }}</td>
          <td :class="item.import >= 0 ? 'green' : 'red'">
            {{ item.import >= 0 ? '+' : '' }}{{ item.import.toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.summary-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.card {
  padding: 10px;
  border-radius: 4px;
  flex: 1;
}
.income {
  background: #e6fffa;
}
.expense {
  background: #ffe6e6;
}
.balance {
  background: #f0f0f0;
}
.search {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th, table td {
  border: 1px solid black;
  padding: 8px;
}
.green {
  color: green;
  font-weight: bold;
}
.red {
  color: red;
  font-weight: bold;
}
</style>