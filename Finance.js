const currentUser = localStorage.getItem("currentUser");

if(!currentUser){
  window.location.href = "index.html";
}

document.getElementById(
  "welcomeUser"
).innerText = `Welcome ${currentUser}`;

const userKey = `finance_${currentUser}`;

let userData = JSON.parse(localStorage.getItem(userKey));

let expenses = userData.expenses || [];

let budget = userData.budget || 0;
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
const budgetDisplay = document.getElementById("budgetDisplay");
const remainingBudget = document.getElementById("remainingBudget");
const totalTransactions = document.getElementById("totalTransactions");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

let chart;



function saveData(){

  userData = {
    budget,
    expenses
  };

  localStorage.setItem(userKey, JSON.stringify(userData));
}

/* Render */

function renderExpenses(data){

  expenseList.innerHTML = "";

  data.forEach(expense => {

    expenseList.innerHTML += `
    
      <div class="expense-item">

        <div>
          <h3>${expense.title}</h3>
          <p>₹${expense.amount}</p>
          <p>${expense.category}</p>
          <p>${expense.date}</p>
        </div>

        <div class="expense-actions">
          <button class="edit-btn" onclick="editExpense(${expense.id})">
            Edit
          </button>

          <button class="delete-btn" onclick="deleteExpense(${expense.id})">
            Delete
          </button>
        </div>

      </div>
    
    `;
  });

  updateSummary();

  updateChart();
}

/* Overview */

function updateSummary(){

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  totalExpense.innerText = `₹${total}`;

  budgetDisplay.innerText = `₹${budget}`;

  remainingBudget.innerText = `₹${budget - total}`;

  totalTransactions.innerText = expenses.length;
}

/* Expenses */

expenseForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const title = document.getElementById("title").value;

  const amount = document.getElementById("amount").value;

  const category = document.getElementById("category").value;

  const date = document.getElementById("date").value;

  const expense = {
    id: Date.now(),
    title,
    amount,
    category,
    date
  };

  expenses.push(expense);

  saveData();

  renderExpenses(expenses);

  expenseForm.reset();

});

/* Deletion */

function deleteExpense(id){

  expenses = expenses.filter(
    expense => expense.id !== id
  );

  saveData();

  renderExpenses(expenses);
}

/* Edit */

function editExpense(id){

  const expense = expenses.find(
    expense => expense.id === id
  );

  document.getElementById("title").value = expense.title;

  document.getElementById("amount").value = expense.amount;

  document.getElementById("category").value = expense.category;

  document.getElementById("date").value = expense.date;

  deleteExpense(id);
}

/* Budget */

// document.getElementById(
//   "setBudgetBtn"
// ).addEventListener("click", () => {

//   budget = document.getElementById("budgetInput").value;

//   saveData();

//   updateSummary();
// });

/* Budget Elements */

const budgetInput = document.getElementById("budgetInput");

const budgetContainer = document.getElementById("budgetContainer");

const budgetDisplayBox = document.getElementById("budgetDisplayBox");

const budgetText = document.getElementById("budgetText");

const editBudgetBtn = document.getElementById("editBudgetBtn");

/* LOAD BUDGET ON PAGE */

if(budget > 0){

  budgetContainer.classList.add("hidden");

  budgetDisplayBox.classList.remove("hidden");

  budgetText.innerText = `₹${budget}`;
}

/* SET BUDGET */

document.getElementById(
  "setBudgetBtn"
).addEventListener("click", () => {

  budget = budgetInput.value;

  if(budget === "") return;

  saveData();

  updateSummary();

  budgetText.innerText = `₹${budget}`;

  budgetContainer.classList.add("hidden");

  budgetDisplayBox.classList.remove("hidden");

});

/* EDIT BUDGET */

editBudgetBtn.addEventListener("click", () => {

  budgetContainer.classList.remove("hidden");

  budgetDisplayBox.classList.add("hidden");

  budgetInput.value = budget;

});


/* Search Bar */

searchInput.addEventListener("input", filterExpenses);

/* Filteration */

filterCategory.addEventListener("change", filterExpenses);

function filterExpenses(){

  const search = searchInput.value.toLowerCase();

  const category = filterCategory.value;

  let filtered = expenses.filter(expense => {

    const matchesSearch =
      expense.title.toLowerCase().includes(search) ||
      expense.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" ||
      expense.category === category;

    return matchesSearch && matchesCategory;
  });

  renderExpenses(filtered);
}

/* Analytics */

function updateChart(){

  const categories = {};

  expenses.forEach(expense => {

    if(categories[expense.category]){
      categories[expense.category] += Number(expense.amount);
    }else{
      categories[expense.category] = Number(expense.amount);
    }

  });

  const labels = Object.keys(categories);

  const data = Object.values(categories);

  const ctx = document.getElementById("expenseChart");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type:"line",
    data:{
      labels:labels,
      datasets:[{
        data:data
      }]
    }
  });

}

/* Theme */

// const themeToggle = document.getElementById("themeToggle");

// if(localStorage.getItem("theme") === "dark"){
//   document.body.classList.add("dark");
// }

// themeToggle.addEventListener("click", () => {

//   document.body.classList.toggle("dark");

//   if(document.body.classList.contains("dark")){
//     localStorage.setItem("theme", "dark");
//   }else{
//     localStorage.setItem("theme", "light");
//   }

// });

const themeToggle = document.getElementById("themeToggle");

/* LOAD THEME */

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeToggle.checked = true;
}

/* TOGGLE THEME */

themeToggle.addEventListener("change", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme", "dark");

    }else{

        localStorage.setItem("theme", "light");
    }

});

/* Logging Out */

document.getElementById(
  "logoutBtn"
).addEventListener("click", () => {

  localStorage.removeItem("currentUser");

  window.location.href = "index.html";
});

/* CSV File  */

document.getElementById(
  "exportCSV"
).addEventListener("click", () => {

  let csv = "Title,Amount,Category,Date\n";

  expenses.forEach(expense => {

    csv += `${expense.title},${expense.amount},${expense.category},${expense.date}\n`;

  });

  const blob = new Blob([csv], { type:"text/csv" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "expenses.csv";

  a.click();
});

/* Start */

renderExpenses(expenses);