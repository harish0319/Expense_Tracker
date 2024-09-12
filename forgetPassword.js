// let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

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
//       forgotPasswordMessage.style.color = 'green';
//     } else {
//       forgotPasswordMessage.textContent = "Username not found.";
//       forgotPasswordMessage.style.color = 'red';
//     }
//   } else {
//     forgotPasswordMessage.textContent = "Please enter both a username and a new password.";
//     forgotPasswordMessage.style.color = 'red';
//   }
// }