import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/expenses/')
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>
      {expenses.map(expense => (
        <div key={expense.id}>
          <h3>{expense.title}</h3>
          <p>Amount: ₹{expense.amount}</p>
          <p>Category: {expense.category}</p>
          <p>Date: {expense.date}</p>
        </div>
      ))}
    </div>
  );
}

export default App;