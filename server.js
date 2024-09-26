const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

let users = [];

// Загрузка пользователей из файла
function loadUsers() {
    if (fs.existsSync("./users.json")) {
        const data = fs.readFileSync("./users.json");
        users = JSON.parse(data);
    }
}

// Сохранение пользователей в файл
function saveUsers() {
    fs.writeFileSync("./users.json", JSON.stringify(users));
}

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.post("/api/users", (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    saveUsers();
    res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex((user) => user.id == id);
    if (index !== -1) {
        users[index] = { id: Number(id), ...req.body };
        saveUsers();
        return res.json(users[index]);
    }
    res.status(404).send("User not found");
});

app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter((user) => user.id != id);
    saveUsers();
    res.sendStatus(204);
});

loadUsers();

app.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});
