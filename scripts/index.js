const selectCurrency = document.getElementById("currency");
const selectCurrencyFilter = document.getElementById("currency-filter");
const tableBody = document.querySelector(".view-section table");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

fetch("https://rich-erin-angler-hem.cyclic.app/students/available", {method: "GET"})
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
        fetch("https://rich-erin-angler-hem.cyclic.app/students/convert", {
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
