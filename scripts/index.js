const selectCurrency = document.getElementById("currency");
const selectCurrencyFilter = document.getElementById("currency-filter");
const tableBody = document.querySelector(".view-section table");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

fetch("https://dull-pink-sockeye-tie.cyclic.app/students/available", {method: "GET"})
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
    viewTransactions();
    findTotalBalance();
    document.getElementById("amount").value = "";
    document.getElementById("currency").value = "";
    document.getElementById("type").value = "";
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
        editButton.addEventListener("click", () => editTransaction(index));

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
    findTotalBalance();
};

function filterTransactions() {
    let amountFrom = document.getElementById("amount-from").value;
    let amountTo = document.getElementById("amount-to").value;
    let userCurrency = document.getElementById("currency-filter").value;
    let userType = document.getElementById("type-filter").value;

    const filteredTransactions = transactions.filter(
        (item) => {
            const amount = item.amount
            const currency = item.currency
            const type = item.type
            return amount >= amountFrom && amount <= amountTo && currency == userCurrency && type == userType;
        }
    )

    displayFilteredTransactions(filteredTransactions);
    document.getElementById("amount-from").value = "";
    document.getElementById("amount-to").value = "";
    document.getElementById("currency-filter").value = "";
    document.getElementById("type-filter").value = "";
};

function displayFilteredTransactions(filteredTransactions) {

    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1);
    };

    filteredTransactions.forEach((transaction, index) => {
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

function convertAmount(from, amount) {
    return new Promise((resolve, reject) => {
        fetch("https://dull-pink-sockeye-tie.cyclic.app/students/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                
                "from": from,
                "to": "USD",
                "amount": amount
    
            })
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => { 
            console.error(error);
            reject(error);
        });
    });
};

async function findTotalBalance() {
    let totalBalance = 0;
    let totalBalanceElement = document.getElementById("total-balance");
    for (const transaction of transactions) {
        const amount = Number(transaction.amount);
        const type = transaction.type;
        const currency = transaction.currency;

        try {
            const convertedAmount = await convertAmount(currency, amount);
            if (type === "income") {
                totalBalance += convertedAmount;
            } else {
                totalBalance -= convertedAmount;
            }
        } catch (error) {
            console.error(error);
        }
    };
    localStorage.setItem("totalBalance", totalBalance);
    totalBalanceElement.innerHTML = `${totalBalance} USD`;

};
findTotalBalance();

function editTransaction(index) {
    const transactionToEdit = transactions[index];
    const amountCell = tableBody.rows[index + 1].cells[0];
    const currencyCell = tableBody.rows[index + 1].cells[1];
    const typeCell = tableBody.rows[index + 1].cells[2];
    const amountData = transactionToEdit.amount;
    const currencyData = transactionToEdit.currency;
    const typeData = transactionToEdit.type;

    amountCell.innerHTML = `<input type='text' id='amount_text${index}' value='${amountData}'>`;
    currencyCell.innerHTML = `<input type='text' id='currency_text${index}' value='${currencyData}'>`;
    typeCell.innerHTML = `<input type='text' id='type_text${index}' value='${typeData}'>`;

    const typeDropdown = document.createElement("select");
    typeDropdown.id = `type_dropdown${index}`;
    const expenseOption = document.createElement("option");
    expenseOption.value = "expense";
    expenseOption.text = "Expense";
    const incomeOption = document.createElement("option");
    incomeOption.value = "income";
    incomeOption.text = "Income";
    typeDropdown.appendChild(expenseOption);
    typeDropdown.appendChild(incomeOption);
    typeDropdown.value = typeData;
    typeCell.innerHTML = "";
    typeCell.appendChild(typeDropdown);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", () => updateTransaction(index));

    const editRemoveCell = tableBody.rows[index + 1].cells[3];
    editRemoveCell.innerHTML = "";
    editRemoveCell.appendChild(updateButton);
}

function updateTransaction(index) {
    const updatedTransaction = {
        amount: document.getElementById(`amount_text${index}`).value,
        currency: document.getElementById(`currency_text${index}`).value,
        type: document.getElementById(`type_text${index}`).value,
    };

    transactions.splice(index, 1);
    transactions.splice(index, 0, updatedTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    viewTransactions();
    findTotalBalance();
}
