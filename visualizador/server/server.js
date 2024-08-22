const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/obtener-archivo', async (req, res) => {
    try {
        const urlArchivo = "http://200.94.83.146:3715/Notas Curso Big Data y Spark.docx";
        const response = await axios.get(urlArchivo, {
             responseType: 'arraybuffer'

         });
        const headers = response.headers;
        res.set(headers);
        res.send(response);//response.data
        console.log(response)
        console.log(headers)
       
    } catch (error) {
        console.error('Error al obtener el archivo:', error.message);
        res.status(500).json({ error: 'No se pudo obtener el documento.' });
    }
});

app.listen(port, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${port}`);
});
