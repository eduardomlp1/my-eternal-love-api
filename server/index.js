const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Importando o multer
const AWS = require('aws-sdk'); // Importando AWS SDK se você for usar S3
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json()); // Para JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para dados de formulário (URL encoded)

// Configuração do Multer para o upload de arquivos
const storage = multer.memoryStorage(); // Armazenar arquivos na memória
const upload = multer({ storage: storage });

// Inicializando o cliente DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();
AWS.config.update({
    region: "us-east-1", // Ajuste conforme necessário
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Endpoint para criar a página de aniversário
app.post('/api/aniversario', upload.array('imagens'), async (req, res) => {
    const { nomeCasal, dataInicio, horarioInicio, email, mensagem, linkMusica } = req.body;
    const imagens = req.files; // Aqui temos os arquivos que foram enviados

    const id = Date.now().toString(); // Gera um ID único baseado em timestamp

    // Adapte isso para onde você vai armazenar as imagens
    const imagensURLs = [];

    // Se você estiver usando S3 para armazenar imagens, você pode adicionar a lógica aqui para fazer o upload
    if (imagens && imagens.length > 0) {
        const s3 = new AWS.S3();
        const uploadPromises = imagens.map((imagem) => {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME, // Coloque o nome do seu bucket aqui
                Key: `${id}-${imagem.originalname}`, // Define o nome do arquivo
                Body: imagem.buffer, // O conteúdo do arquivo
                ContentType: imagem.mimetype, // Tipo de conteúdo
                ACL: 'public-read' // Para que o arquivo fique acessível publicamente (ajuste conforme necessário)
            };

            return s3.upload(params).promise().then(data => {
                imagensURLs.push(data.Location); // Adiciona a URL pública da imagem ao array
            });
        });

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao fazer upload das imagens' });
        }
    }

    // Agora, gravar os dados no DynamoDB
    const params = {
        TableName: "Aniversarios", // Nome da tabela no DynamoDB
        Item: {
            id,
            nomeCasal,
            dataInicio,
            horarioInicio,
            email,
            mensagem,
            linkMusica,
            imagens: imagensURLs // Salve a localização das imagens no DynamoDB
        }
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Página criada com sucesso', id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});