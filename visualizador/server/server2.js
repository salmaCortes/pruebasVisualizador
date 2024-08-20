const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const AWS = require('aws-sdk');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Para manejar JSON en el cuerpo de la solicitud

app.post('/convertir', async (req, res) => {
    const { fileUrl = null, fileExtension = null, bucket = null, file = null } = req.body;
    console.log(`fileExtension: ${fileExtension}, file: ${file}`);


    try {
        // Asegúrate de que la carpeta uploads exista
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        if (fileExtension === 'pdf') {
            // Configuración del cliente S3 de Wasabi
            const s3 = new AWS.S3({
                accessKeyId: '24XG5L9P2ZNBRLBEUYOS', // Access Key de Wasabi
                secretAccessKey: 'XS8OIvTyXlZk18NBDniayFpQkb6JwDZuWAoOr3DF', //  Secret Key de Wasabi
                endpoint: 'https://s3.us-central-1.wasabisys.com', // Endpoint específico de Wasabi
                region: 'us-central-1', // Región correspondiente
                signatureVersion: 'v4'
            });
        
            const checkCors = async (bucket, file) => {
                try {
                    const url = `https://s3.us-central-1.wasabisys.com/${bucket}/${file}`;
            
                    await axios.options(url, {
                        headers: {
                            'Host': 's3.us-central-1.wasabisys.com',
                            'Origin': 'http://localhost:3001',
                            'Access-Control-Request-Method': 'GET',
                            'Access-Control-Request-Headers': 'Content-Type'
                        }
                    });
            
                    console.log('CORS preflight request fue exitoso');
                } catch (error) {
                    console.error('Error en CORS preflight request:', error.message);
                }
            };
        
            const execute = async () => {
                try {
                   
                    
                     // Primero se ejecuta checkCors
                    await checkCors(bucket, file);
                    
                    // Luego se obtiene la URL firmada
                    const url = s3.getSignedUrl('getObject', {
                        Bucket: bucket,
                        Key: file
                    });

                    res.setHeader('Content-Type', 'application/json');
                    // Enviar la URL firmada y otros detalles si es necesario
                    res.json({
                        url: url, // URL firmada para descargar el archivo
                    });
                } catch (error) {
                    console.error('Error en el proceso:', error.message);
                    res.status(500).send('Error al obtener la URL firmada.');
                }
            };
        
            execute();
        }else {
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
                    res.json({ pdfUrl: `http://localhost:3001/uploads/${outputFile}` });
                } else {
                    res.status(500).send('El archivo PDF convertido no se encontró');
                }
            });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
