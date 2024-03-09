const selectCurrency = document.getElementById("currency");

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