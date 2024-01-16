const setStorage = (Expenses) =>
  localStorage.setItem("despesas", JSON.stringify(Expenses));

const getStorage = () => JSON.parse(localStorage.getItem("despesas")) ?? [];

const createExpenses = (expense) => {
  const dataBase = getStorage();
  dataBase.push(expense);
  setStorage(dataBase);
};

const readExpenses = () => getStorage();

const deleteExpenses = (index) => {
  const db = getStorage();
  db.splice(index, 1);
  setStorage(db);
  updateTable();
};

const updateExpenses = (index, expense) => {
  const db = getStorage();
  db[index] = expense;
  setStorage(db);
  updateTable();
};

const createRow = (expense, index) => {
  const newRow = document.createElement("tr");
  const data = new Date(expense.date);
  const dataFormatada = data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  newRow.innerHTML = `
  <td>${dataFormatada}</td>
  <td class="text-start">${expense.description}</td>
  <td class="text-center expenseValue">${expense.value}</td>
  <td class="td-button">
    <button
      class="btn btn-sm btn-warning mb-2 mb-md-0"
      data-bs-toggle="modal"
      data-bs-target="#modal"
      id="edit-${index}"
    >
      <i class="bi bi-pen"></i> Editar
    </button>
    <button class="btn btn-sm btn-danger" id="delete-${index}">
      <i class="bi bi-trash"></i> Excluir
    </button>
  </td>`;
  document.querySelector("#tableExpenses > tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableExpenses > tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const totalExp = () => {
  const db = readExpenses();
  let value = 0;
  db.forEach((val) => (value += parseFloat(val.value)));
  document.getElementById("totalScreen").innerHTML = value.toFixed(2);
};

const updateTable = () => {
  const db = readExpenses();
  clearTable();
  db.forEach(createRow);
  totalExp();
};

const isValidForm = () => {
  const validacao = document.getElementById("form").reportValidity();
  if (!validacao) {
    alert("Não foi possivel adicionar despesa, algum campo ficou vazio...");
  } else {
    return validacao;
  }
};

const saveExpense = () => {
  if (isValidForm()) {
    const expense = {
      date: document.getElementById("data").value,
      description: document.getElementById("description").value,
      value: document.getElementById("valor").value,
    };
    const index = document.getElementById("data").dataset.index;
    if (index == "new") {
      createExpenses(expense);
      updateTable();
    } else {
      updateExpenses(index, expense);
      updateTable();
    }
  }
};

const clearFields = () => {
  console.log("teste");
  const fields = document.querySelectorAll(".form-control");
  fields.forEach((field) => (field.value = ""));
};

const filldExpense = (expense) => {
  document.getElementById("data").value = expense.date;
  document.getElementById("description").value = expense.description;
  document.getElementById("valor").value = expense.value;
  document.getElementById("data").dataset.index = expense.index;
};

const editExpense = (index) => {
  const expense = readExpenses()[index];
  expense.index = index;
  filldExpense(expense);
};

const editeDelete = (e) => {
  if (e.target.type === "submit") {
    const [action, index] = e.target.id.split("-");

    if (action == "edit") {
      editExpense(index);
    } else {
      const expense = readExpenses()[index];
      const response = confirm(
        `Deseja realmente excluir a despesa ${expense.description} - R$ ${expense.value}`
      );
      if (response) {
        deleteExpenses(index);
        updateTable();
      }
    }
  }
};

updateTable();

document.getElementById("saveExpense").addEventListener("click", saveExpense);

document
  .querySelector("#tableExpenses>tbody")
  .addEventListener("click", editeDelete);

document.getElementById("cadastrar").addEventListener("click", clearFields);
