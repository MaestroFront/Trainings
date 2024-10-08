document.addEventListener("DOMContentLoaded", async () => {
    loadUsers();

    const registerBtn = document.getElementById("registerBtn");
    const modal = document.getElementById("registrationModal");
    const closeModalBtn = modal.querySelector(".close");
    const addUserBtn = document.getElementById("addUserBtn");

    registerBtn.onclick = () => (modal.style.display = "block");
    closeModalBtn.onclick = () => (modal.style.display = "none");

    addUserBtn.onclick = async () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const company = document.getElementById("company").value;
        const info = document.getElementById("info").value;

        const user = { name, phone, company, info };
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("company").value = "";
        document.getElementById("info").value = "";

        modal.style.display = "none";
        loadUsers();
    };

    async function loadUsers() {
        const response = await fetch("/api/users");
        const users = await response.json();
        const userList = document.getElementById("userList");
        userList.innerHTML = "";

        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.company}</td>
                <td>${user.info}</td>
                <td>${index < 10 ? "100 рублей" : "200 рублей"}</td>
                <td>
                    <button onclick="editUser(${
                        user.id
                    })">Редактировать</button>
                    <button onclick="deleteUser(${user.id})">Удалить</button>
                </td>
            `;
            userList.appendChild(row);
        });
    }

    window.deleteUser = async (id) => {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        loadUsers();
    };

    window.editUser = async (id) => {
        // Код для редактирования пользователя (показать модальное окно с текущими данными пользователя)

        const response = await fetch(`/api/users/${id}`);
        const user = await response.json();

        document.getElementById("name").value = user.name;
        document.getElementById("phone").value = user.phone;
        document.getElementById("company").value = user.company;
        document.getElementById("info").value = user.info;

        modal.style.display = "block";

        addUserBtn.onclick = async () => {
            const updatedUser = {
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                company: document.getElementById("company").value,
                info: document.getElementById("info").value,
            };
            await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

            modal.style.display = "none";
            loadUsers();
        };
    };
});
