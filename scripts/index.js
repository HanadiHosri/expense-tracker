const selectCurrency = document.getElementById("currency");
const selectCurrencyFilter = document.getElementById("currency-filter");
const tableBody = document.querySelector(".view-section table");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

fetch("https://ivory-ostrich-yoke.cyclic.app/students/available", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.code;
            option.text = item.code;
            selectCurrency.add(option);

            const filterOption = document.createElement("option");
            filterOption.value = item.code;
            filterOption.text = item.code;
            selectCurrencyFilter.add(filterOption);
        });
    })
    .catch(error => console.error(error));

function addTransaction() {
    let amount = document.getElementById("amount").value;
    let currency = document.getElementById("currency").value;
    let type = document.getElementById("type").value;

    let newTransaction = {amount, currency, type};
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    viewTransactions()
};

function viewTransactions() {
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1);
    };

    transactions.forEach((transaction, index) => {
        const row = tableBody.insertRow();
        const amountCell = row.insertCell(0);
        const currencyCell = row.insertCell(1);
        const typeCell = row.insertCell(2);
        const editRemoveCell = row.insertCell(3);
        const editButton = document.createElement("button");
        const editIcon = document.createElement("i");
        const removeButton = document.createElement("button");
        const trashIcon = document.createElement("i");

        amountCell.textContent = transaction.amount;
        currencyCell.textContent = transaction.currency;
        typeCell.textContent = transaction.type;

        editIcon.className = "fas fa-edit";
        editButton.appendChild(editIcon);

        trashIcon.className = "fas fa-trash-alt";
        removeButton.appendChild(trashIcon);
        removeButton.addEventListener("click", () => removeTransaction(index));

        editRemoveCell.appendChild(editButton);
        editRemoveCell.appendChild(removeButton);
    });
};

viewTransactions();

function removeTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    viewTransactions();
};

function filterTransactions() {
    let amountFrom = document.getElementById("amount-from").value;
    let amountTo = document.getElementById("amount-to").value;
    let currency = document.getElementById("currency-filter").value;
    let type = document.getElementById("type-filter").value;

};