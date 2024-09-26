const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

let users = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Эндпоинт для получения всех пользователей
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Эндпоинт для добавления пользователей
app.post("/api/users", (req, res) => {
    users = req.body; // Сохраняем полученные данные
    res.sendStatus(200);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
