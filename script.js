// Fetch from localStorage or initialize arrays
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Handle login
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  if (username && password) {
    const account = accounts.find(acc => acc.username === username);
    if (account && account.password === password) {
      message.textContent = "Login successful!";
      message.style.color = 'green';
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'addUsers.html';
    } else {
      message.textContent = "Invalid credentials.";
      message.style.color = 'red';
    }
  } else {
    message.textContent = "Please enter both username and password.";
    message.style.color = 'red';
  }
}

// Handle account creation
function createAccount() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  if (username && password) {
    if (!accounts.some(acc => acc.username === username)) {
      accounts.push({ username, password });
      localStorage.setItem('accounts', JSON.stringify(accounts));
      message.textContent = `Account created. Please log in.`;
      message.style.color = 'green';
    } else {
      message.textContent = "Account exists. Please log in.";
      message.style.color = 'red';
    }
  } else {
    message.textContent = "Please enter both username and password.";
    message.style.color = 'red';
  }
}

// Handle adding users
function addPerson() {
  const personName = document.getElementById('personName').value.trim();
  if (personName) {
    users.push(personName);
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    document.getElementById('personName').value = '';
  } else {
    alert("Please enter a name.");
  }
}

// Handle deleting a user
function deletePerson(index) {
  users.splice(index, 1); // Remove user from array
  localStorage.setItem('users', JSON.stringify(users)); // Update localStorage
  displayUsers(); // Refresh the user list
}

function displayUsers() {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = ''; // Clear the table
  users.forEach((user, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${user}</td>
        <td><button onclick="deletePerson(${index})">Delete</button></td>
      </tr>
    `;
  });
}

// Populate user options in the expense form
function populateUserOptions() {
  const personWhoPaid = document.getElementById('personWhoPaid');
  personWhoPaid.innerHTML = users.map(user => `<option value="${user}">${user}</option>`).join('');
}

// Handle adding expenses
function addExpense() {
  const paidBy = document.getElementById('personWhoPaid').value;
  const amount = document.getElementById('expenseAmount').value;
  const date = document.getElementById('expenseDate').value;
  const usage = document.getElementById('usageOfAmount').value;

  if (paidBy && amount && date && usage) {
    expenses.push({ id: Date.now(), paidBy, amount: parseFloat(amount), date, usage });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.getElementById('expenseMessage').textContent = 'Expense added successfully!';
    document.getElementById('expenseMessage').style.color = 'green';
    document.getElementById('expenseForm').reset();
    displayExpenses();
  } else {
    document.getElementById('expenseMessage').textContent = 'Please fill in all fields.';
    document.getElementById('expenseMessage').style.color = 'red';
  }
}

// Redirect to the add expenses page
function proceedToAddExpenses() {
  window.location.href = 'addExpenses.html'; // Adjust the URL based on your file structure
}

// Display expenses and update settlements
function displayExpenses() {
  const expenseTable = document.getElementById('expenseTableBody');
  expenseTable.innerHTML = expenses.map((expense, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${expense.paidBy}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td>${expense.date}</td>
      <td>${expense.usage}</td>
      <td><button onclick="editExpense(${expense.id})">Edit</button></td>
      <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
    </tr>
  `).join('');
  calculateAmounts();
}

// Edit an expense
function editExpense(id) {
  const expense = expenses.find(exp => exp.id === id);
  if (expense) {
    document.getElementById('personWhoPaid').value = expense.paidBy;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('usageOfAmount').value = expense.usage;
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
  }
}

// Delete an expense
function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}

// Calculate amounts to settle
function calculateAmounts() {
  let totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  let userExpenses = users.reduce((obj, user) => ({ ...obj, [user]: 0 }), {});

  expenses.forEach(exp => userExpenses[exp.paidBy] += exp.amount);
  let equalShare = totalExpense / users.length;
  let payers = [], receivers = [];

  users.forEach(user => {
    let amountToPay = equalShare - userExpenses[user];
    if (amountToPay > 0) payers.push({ user, amount: amountToPay });
    if (amountToPay < 0) receivers.push({ user, amount: -amountToPay });
  });

  const settlementSummary = document.getElementById('settlementSummary');
  settlementSummary.innerHTML = '';
  payers.forEach(payer => {
    receivers.forEach(receiver => {
      if (payer.amount > 0 && receiver.amount > 0) {
        let payment = Math.min(payer.amount, receiver.amount);
        settlementSummary.innerHTML += `<li>${payer.user} pays ${receiver.user} ${payment.toFixed(2)}</li>`;
        payer.amount -= payment;
        receiver.amount -= payment;
      }
    });
  });
}

// Ensure expenses and users are displayed on page load
window.onload = function () {
  if (document.getElementById('expenseTableBody')) displayExpenses();
  if (document.getElementById('userTableBody')) displayUsers();
  if (document.getElementById('personWhoPaid')) populateUserOptions();
};

// // Fetch from localStorage or initialize arrays
// let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
// let users = JSON.parse(localStorage.getItem('users')) || [];
// let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// // Handle login
// function login() {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value.trim();
//   const message = document.getElementById('message');

//   if (username && password) {
//     const account = accounts.find(acc => acc.username === username);
//     if (account) {
//       if (account.password === password) {
//         message.textContent = "Login successful!";
//         message.style.color = 'green';
//         localStorage.setItem('loggedInUser', username); // Save the logged-in user
//         window.location.href = 'addUsers.html'; // Redirect to Add Users page
//       } else {
//         message.textContent = "Incorrect password. Please try again.";
//         message.style.color = 'red';
//       }
//     } else {
//       message.textContent = "Username not found. Please create an account.";
//       message.style.color = 'red';
//     }
//   } else {
//     message.textContent = "Please enter both username and password.";
//     message.style.color = 'red';
//   }
// }

// // Handle account creation
// function createAccount() {
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value.trim();
//   const message = document.getElementById('message');

//   if (username && password) {
//     const accountExists = accounts.some(acc => acc.username === username);
//     if (!accountExists) {
//       accounts.push({ username, password });
//       localStorage.setItem('accounts', JSON.stringify(accounts));
//       message.textContent = `Account created for ${username}. You can now log in.`;
//       message.style.color = 'green';
//     } else {
//       message.textContent = "Account already exists. Please log in.";
//       message.style.color = 'red';
//     }
//   } else {
//     message.textContent = "Please enter both a username and password to create an account.";
//     message.style.color = 'red';
//   }
// }

// // Redirect to the forgot password page
// function forgotPassword() {
//   window.location.href = "forgotPassword.html";
// }

// // Handle password reset
// function resetPassword() {
//   const forgotUsername = document.getElementById('forgotUsername').value.trim();
//   const newPassword = document.getElementById('newPassword').value.trim();
//   const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');

//   if (forgotUsername && newPassword) {
//     const accountIndex = accounts.findIndex(acc => acc.username === forgotUsername);

//     if (accountIndex !== -1) {
//       accounts[accountIndex].password = newPassword;
//       localStorage.setItem('accounts', JSON.stringify(accounts));
//       forgotPasswordMessage.textContent = "Password updated successfully!";
//       forgotPasswordMessage.classList.remove('error-message');
//       forgotPasswordMessage.classList.add('success-message');
//     } else {
//       forgotPasswordMessage.textContent = "Username not found.";
//       forgotPasswordMessage.style.color = 'red';
//     }
//   } else {
//     forgotPasswordMessage.textContent = "Please enter both a username and a new password.";
//     forgotPasswordMessage.style.color = 'red';
//   }
// }

// // Handle adding users
// function addPerson() {
//   const personName = document.getElementById('personName').value.trim();
//   if (personName) {
//     users.push(personName);
//     localStorage.setItem('users', JSON.stringify(users));
//     displayUsers();
//     document.getElementById('personName').value = '';
//   }
// }

// function displayUsers() {
//   const tbody = document.getElementById('userTableBody');
//   tbody.innerHTML = '';
//   users.forEach((user, index) => {
//     tbody.innerHTML += `<tr><td>${index + 1}</td><td>${user}</td></tr>`;
//   });
// }

// function proceedToAddExpenses() {
//   window.location.href = 'addExpenses.html';
// }

// function populateUserOptions() {
//   const personWhoPaid = document.getElementById('personWhoPaid');
//   personWhoPaid.innerHTML = '';
//   users.forEach(user => {
//     const option = document.createElement('option');
//     option.value = user;
//     option.text = user;
//     personWhoPaid.appendChild(option);
//   });
// }

// // Handle adding expenses
// function addExpense() {
//   const paidBy = document.getElementById('personWhoPaid').value;
//   const amount = document.getElementById('expenseAmount').value;
//   const date = document.getElementById('expenseDate').value;
//   const usage = document.getElementById('usageOfAmount').value;

//   if (paidBy && amount && date && usage) {
//     const newExpense = {
//       id: Date.now(),
//       paidBy: paidBy,
//       amount: parseFloat(amount),
//       date: date,
//       usage: usage
//     };

//     expenses.push(newExpense);
//     localStorage.setItem('expenses', JSON.stringify(expenses));

//     document.getElementById('expenseMessage').textContent = 'Expense added successfully!';
//     document.getElementById('expenseMessage').style.color = 'green';
//     document.getElementById('expenseForm').reset();
//     displayExpenses(); // Display all expenses after adding
//   } else {
//     document.getElementById('expenseMessage').textContent = 'Please fill in all fields.';
//     document.getElementById('expenseMessage').style.color = 'red';
//   }
// }

// // Display all expenses
// function displayExpenses() {
//   const expenseTable = document.getElementById('expenseTableBody');
//   expenseTable.innerHTML = '';

//   expenses.forEach((expense, index) => {
//     expenseTable.innerHTML += `
//       <tr>
//         <td>${index + 1}</td>
//         <td>${expense.paidBy}</td>
//         <td>${expense.amount.toFixed(2)}</td>
//         <td>${expense.date}</td>
//         <td>${expense.usage}</td>
//         <td><button onclick="editExpense(${expense.id})">Edit</button></td>
//         <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
//       </tr>
//     `;
//   });

//   calculateAmounts(); // Update settlements
// }

// // Edit an expense
// function editExpense(id) {
//   const expense = expenses.find(exp => exp.id === id);
//   if (expense) {
//     document.getElementById('personWhoPaid').value = expense.paidBy;
//     document.getElementById('expenseAmount').value = expense.amount;
//     document.getElementById('expenseDate').value = expense.date;
//     document.getElementById('usageOfAmount').value = expense.usage;

//     // Remove the expense temporarily while editing
//     expenses = expenses.filter(exp => exp.id !== id);
//     localStorage.setItem('expenses', JSON.stringify(expenses));
//     displayExpenses();
//   }
// }

// // Delete an expense
// function deleteExpense(id) {
//   expenses = expenses.filter(exp => exp.id !== id);
//   localStorage.setItem('expenses', JSON.stringify(expenses));
//   displayExpenses();
// }

// // Calculate individual amounts to settle
// function calculateAmounts() {
//   let totalExpense = 0;
//   const userExpenses = {};

//   users.forEach(user => {
//     userExpenses[user] = 0;
//   });

//   expenses.forEach(expense => {
//     totalExpense += expense.amount;
//     userExpenses[expense.paidBy] += expense.amount;
//   });

//   const equalShare = totalExpense / users.length;
//   const payers = [];
//   const receivers = [];

//   users.forEach(user => {
//     const amountPaid = userExpenses[user];
//     const amountToPay = equalShare - amountPaid;

//     if (amountToPay > 0) {
//       payers.push({ user, amount: amountToPay });
//     } else if (amountToPay < 0) {
//       receivers.push({ user, amount: Math.abs(amountToPay) });
//     }
//   });

//   const settlementSummary = document.getElementById('settlementSummary');
//   settlementSummary.innerHTML = '';

//   payers.forEach(payer => {
//     receivers.forEach(receiver => {
//       if (payer.amount > 0 && receiver.amount > 0) {
//         const payment = Math.min(payer.amount, receiver.amount);

//         const li = document.createElement('li');
//         li.textContent = `${payer.user} needs to pay ${receiver.user} ${payment.toFixed(2)}.`;
//         settlementSummary.appendChild(li);

//         payer.amount -= payment;
//         receiver.amount -= payment;
//       }
//     });
//   });
// }

// // Ensure expenses and users are displayed on page load
// window.onload = function () {
//   if (document.getElementById('expenseTableBody')) {
//     displayExpenses();
//   }
//   if (document.getElementById('userTableBody')) {
//     displayUsers();
//   }
//   if (document.getElementById('personWhoPaid')) {
//     populateUserOptions();
//   }
// };