const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilita CORS para todas las rutas
app.use(cors());

// Reemplaza con tu token de GitHub
const githubToken = '5AOD8LEK017ALG4TB7I0';

// Endpoint para obtener archivos desde GitHub
app.get('/get-file/', async (req, res) => {
    const fileUrl = req.query.url; // Recibe la URL del archivo como parámetro
    console.log(fileUrl)
    const fileType = path.extname(fileUrl); // Obtiene la extensión del archivo

    try {
        const response = await axios.get(fileUrl, {
            headers: {
                Authorization: `key ${githubToken}` // Incluye el token de GitHub
            },
            responseType: 'arraybuffer'
        });

        // Ajusta el tipo MIME según el tipo de archivo
        const contentTypeMap = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.jpg': ' image/jpg'
        };
        const contentType = contentTypeMap[fileType] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.send(response.data);

        console.log(response);
    } catch (error) {
        console.error('Error fetching document:', error.message);
        res.status(500).send('Error fetching document');
    }
});

// Inicia el servidor en el puerto 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
