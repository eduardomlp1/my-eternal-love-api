// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoints e lógica do servidor aqui...

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});