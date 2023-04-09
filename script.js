const form = document.querySelector("form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const incomeList = document.querySelector("#income-list");
const expenseList = document.querySelector("#expense-list");
const balance = document.querySelector("#balance");
const editButtons = document.querySelectorAll(".edit-btn");

descriptionInput.setAttribute("autocomplete", "off");
amountInput.setAttribute("autocomplete", "off");

form.addEventListener("submit", addTransaction);
incomeList.addEventListener("click", deleteOrEditTransaction);
expenseList.addEventListener("click", deleteOrEditTransaction);

let transactions = {
  income: [],
  expense: [],
};

function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (description.trim() === "" || amount <= 0 || type === "") {
    alert("Proszę wprowadź prawidłowe dane do opisu, kwoty i typu");
    return;
  }

  const transaction = {
    id: new Date().getTime(),
    description,
    amount,
  };

  transactions[type].push(transaction);
  updateUI();
  resetForm();
  resetSubmitButton();
}

function resetForm() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeInput.value = "";
  typeInput.classList.remove("invalid");
  typeInput.nextElementSibling.textContent = "";
  descriptionInput.focus();
}
function resetSubmitButton() {
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.textContent = "Dodaj";
}
function deleteTransaction(id, type) {
  transactions[type] = transactions[type].filter(
    (transaction) => transaction.id !== id
  );
  updateUI();
}

function editTransaction(id, type) {
  const transaction = transactions[type].find(
    (transaction) => transaction.id === id
  );
  const { description, amount } = transaction;

  let editedDescription = prompt("Wprowadź nowy opis", description);
  let editedAmount = Number(prompt("Wprowadź nową kwotę", amount));

  if (editedDescription.trim() === "" || editedAmount <= 0) {
    alert("Proszę wprowadź prawidłowe dane do opisu, kwoty i typu");
    return;
  }

  transaction.description = editedDescription;
  transaction.amount = editedAmount;

  updateUI();
}

function deleteOrEditTransaction(event) {
  const target = event.target;
  const id = Number(target.dataset.id);
  const type = target.dataset.type;

  if (target.classList.contains("delete-btn")) {
    deleteTransaction(id, type);
  } else if (target.classList.contains("edit-btn")) {
    editTransaction(id, type);
  }
}

function updateUI() {
  updateIncomeUI();
  updateExpenseUI();
  updateBalanceUI();
}

function updateIncomeUI() {
  let incomeHTML = "";
  let incomeSum = 0;

  transactions.income.forEach((income) => {
    incomeHTML += `<li>${income.description} - ${income.amount} PLN 
      <button class="delete-btn" data-id="${income.id}" data-type="income">Usuń</button>
      <button class="edit-btn" data-id="${income.id}" data-type="income">Edytuj</button></li>`;
    incomeSum += income.amount;
  });

  incomeHTML += `<li class="total">Suma dochodów: ${incomeSum} PLN</li>`;
  incomeList.innerHTML = incomeHTML;
}

function updateExpenseUI() {
  let expenseHTML = "";
  let expenseSum = 0;

  transactions.expense.forEach((expense) => {
    expenseHTML += `<li>${expense.description} - ${expense.amount} PLN 
      <button class="delete-btn" data-id="${expense.id}" data-type="expense">Usuń</button>
      <button class="edit-btn" data-id="${expense.id}" data-type="expense">Edytuj</button></li>`;
    expenseSum += expense.amount;
  });

  expenseHTML += `<li class="total">Suma wydatków: ${expenseSum} PLN</li>`;
  expenseList.innerHTML = expenseHTML;
}

function updateBalanceUI() {
  const income = transactions.income.reduce(
    (total, income) => total + income.amount,
    0
  );
  const expense = transactions.expense.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const balanceAmount = income - expense;

  if (balanceAmount > 0) {
    balance.textContent = `Możesz wydać jeszcze ${balanceAmount}`;
    balance.style.color = "green";
  } else if (balanceAmount < 0) {
    balance.textContent = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balanceAmount
    )}`;
    balance.style.color = "red";
  } else {
    balance.textContent = "Bilans jest 0";
    balance.style.color = "black";
  }
}
