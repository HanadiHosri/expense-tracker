const selectCurrency = document.getElementById("currency");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

fetch("https://ivory-ostrich-yoke.cyclic.app/students/available")
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.code;
            option.text = item.code;
            selectCurrency.add(option);
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
    
}