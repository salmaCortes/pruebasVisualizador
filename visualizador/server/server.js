const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const libre = require('libreoffice-convert');
const { promisify } = require('util');

libre.convertAsync = promisify(libre.convert);

const app = express();
const port = 3001; 

app.use(cors());

app.get('/convert', async (req, res) => {
    try {
        const fileName = req.query.fileName;
        if (!fileName) {
            return res.status(400).send('No fileName query parameter provided');
        }
        
      
        const docUrl = `http://localhost:8081/${fileName}`; 
        const ext = '.pdf';

        // Descargar el archivo desde la URL
        const response = await axios({
            url: docUrl,
            responseType: 'arraybuffer',
        });
        const docBuf = Buffer.from(response.data);

        // Convertir a formato PDF
        const pdfBuf = await libre.convertAsync(docBuf, ext, undefined);

        // Enviar el archivo PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuf);
    } catch (err) {
        console.error(`Error converting file: ${err}`);
        res.status(500).send('Error converting file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
