const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementsByClassName("close")[0];
const registrationForm = document.getElementById("registrationForm");
const registeredUsersTable = document.getElementById("registeredUsers");
let users = [];

// Открытие модального окна
openModalButton.onclick = function () {
    modal.style.display = "block";
};

// Закрытие модального окна
closeModalButton.onclick = function () {
    modal.style.display = "none";
};

// Отправка формы
registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const companyName = document.getElementById("companyName").value;
    const about = document.getElementById("about").value;

    const user = {
        fullName,
        phoneNumber,
        companyName,
        about,
    };

    addUser(user);
    modal.style.display = "none";
    registrationForm.reset();
});

// Добавление пользователя в таблицу
function addUser(user) {
    users.push(user);
    renderTable();
    saveUsersToServer();
}

// Отрисовка таблицы
function renderTable() {
    registeredUsersTable.innerHTML = "";
    users.forEach((user, index) => {
        const payment = index < 10 ? "100 рублей" : "200 рублей";
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.fullName}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.companyName}</td>
                <td>${user.about}</td>
                <td>${payment}</td>
                <td>
                    <button onclick="editUser(${index})">Редактировать</button>
                    <button onclick="removeUser(${index})">Удалить</button>
                </td>
            </tr>`;
        registeredUsersTable.innerHTML += row;
    });
}

// Удаление пользователя
function removeUser(index) {
    users.splice(index, 1);
    renderTable();
    saveUsersToServer();
}

// Редактирование пользователя
function editUser(index) {
    const user = users[index];
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("phoneNumber").value = user.phoneNumber;
    document.getElementById("companyName").value = user.companyName;
    document.getElementById("about").value = user.about;

    modal.style.display = "block";
    registrationForm.onsubmit = function (e) {
        e.preventDefault();
        users[index] = {
            fullName: document.getElementById("fullName").value,
            phoneNumber: document.getElementById("phoneNumber").value,
            companyName: document.getElementById("companyName").value,
            about: document.getElementById("about").value,
        };
        renderTable();
        modal.style.display = "none";
        saveUsersToServer();
        registrationForm.reset();
    };
}

// Сохранение данных на сервере
function saveUsersToServer() {
    fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
    });
}

// Загрузка пользователей при загрузке страницы
window.onload = function () {
    fetch("http://localhost:3000/api/users")
        .then((response) => response.json())
        .then((data) => {
            users = data;
            renderTable();
        });
};
