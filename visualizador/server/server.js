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
app.use(express.json()); // Para procesar JSON en el cuerpo de la solicitud

// Ruta GET para obtener archivos pdf
app.get('/obtener-archivo', async (req, res) => {
    const { bucket, file} = req.query;

   
    // Manejo de archivo en S3
    const s3 = new AWS.S3({
        accessKeyId: '24XG5L9P2ZNBRLBEUYOS',
        secretAccessKey: 'XS8OIvTyXlZk18NBDniayFpQkb6JwDZuWAoOr3DF',
        endpoint: 'https://s3.us-central-1.wasabisys.com',
        region: 'us-central-1',
        signatureVersion: 'v4'
    });

    const getSignedUrl = (bucket, key) => {
        return s3.getSignedUrlPromise('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: 60
        });
    };

    try {
        const fileType = path.extname(file);

        const contentTypeMap = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.jpg': 'image/jpg',
            '.png': 'image/png'
        };
        const contentType = contentTypeMap[fileType] || 'application/octet-stream';

        const signedUrl = await getSignedUrl(bucket, file);

        const response = await axios.get(signedUrl, {
            headers: {
                'Content-Type': contentType
            },
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error('Error al obtener el archivo:', error.message);
        res.status(500).send('Error al obtener el archivo');
    }
  
});

// Ruta POST para convertir archivos de word y powerpoint a pdf
app.post('/convertir-archivo', async (req, res) => {
    
    const { fileExtension,fileUrl } = req.body ;

    
        // Manejo de otros tipos de archivos
        try {
            const uploadsDir = path.join(__dirname, 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const response = await axios({
                url: fileUrl,
                responseType: 'arraybuffer'
            });

            const inputFile = path.join(uploadsDir, `tempfile.${fileExtension}`);
            fs.writeFileSync(inputFile, response.data);

            const outputFile = `tempfile.pdf`;
            const outputFilePath = path.join(uploadsDir, outputFile);

            exec(`libreoffice --headless --convert-to pdf "${inputFile}" --outdir "${uploadsDir}"`, (error) => {
                if (error) {
                    console.error(`Error al convertir: ${error.message}`);
                    return res.status(500).send('Error en la conversión');
                }

                if (fs.existsSync(outputFilePath)) {
                    try {
                        fs.unlinkSync(inputFile);
                    } catch (unlinkError) {
                        console.error(`Error al eliminar el archivo: ${unlinkError.message}`);
                    }

                    res.json({ pdfUrl: `http://localhost:3001/uploads/${outputFile}` });
                } else {
                    res.status(500).send('El archivo PDF convertido no se encontró');
                }
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error.message);
            res.status(500).send('Error al procesar la solicitud');
        }
    
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${port}`);
});
