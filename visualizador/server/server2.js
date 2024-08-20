const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); // Para manejar JSON en el cuerpo de la solicitud

app.post('/convertir', async (req, res) => {
    const { fileUrl, fileExtension } = req.body; 

    if (!fileUrl || !fileExtension) {
        return res.status(400).send('Faltan parámetros en la solicitud');
    }

    try {
        // Asegúrate de que la carpeta uploads exista
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Descarga el archivo desde la URL
        const response = await axios({
            url: fileUrl,
            responseType: 'arraybuffer'
        });

        // Guarda el archivo en el servidor
        const inputFile = path.join(uploadsDir, `tempfile.${fileExtension}`);
        fs.writeFileSync(inputFile, response.data);

        const outputFile = `tempfile.pdf`;
        const outputFilePath = path.join(uploadsDir, outputFile);

        // Convierte el archivo a PDF usando LibreOffice
        exec(`libreoffice --headless --convert-to pdf "${inputFile}" --outdir "${uploadsDir}"`, (error) => {
            if (error) {
                console.error(`Error al convertir: ${error.message}`);
                return res.status(500).send('Error en la conversión');
            }

            // Verifica si el archivo PDF fue creado
            if (fs.existsSync(outputFilePath)) {
                // Elimina el archivo de entrada temporal
                try {
                    fs.unlinkSync(inputFile);
                } catch (unlinkError) {
                    console.error(`Error al eliminar el archivo: ${unlinkError.message}`);
                }

                // Devuelve la URL del archivo PDF
                res.json({ pdfUrl: `http://localhost:8000/uploads/${outputFile}` });
            } else {
                res.status(500).send('El archivo PDF convertido no se encontró');
            }
        });
    } catch (error) {
        console.error('Error al descargar el archivo:', error.message);
        res.status(500).send('Error al descargar el archivo');
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
