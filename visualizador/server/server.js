const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors());

// Función para realizar la solicitud OPTIONS (preflight)
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



// configuración del servicio de cliente s3 de amazon
const s3 = new AWS.S3({
    accessKeyId: '24XG5L9P2ZNBRLBEUYOS', // Access Key de Wasabi
    secretAccessKey: 'XS8OIvTyXlZk18NBDniayFpQkb6JwDZuWAoOr3DF', //  Secret Key de Wasabi
    endpoint: 'https://s3.us-central-1.wasabisys.com', // Endpoint específico de Wasabi
    region: 'us-central-1', // Región correspondiente
    signatureVersion: 'v4'
});

// Función para obtener una URL prefirmada para la solicitud GET(más que nada es para  poder obtener la URL del archivo sin problemas ya con las válidaciones)
const getSignedUrl = (bucket, key) => {
    return s3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: 60 // La URL prefirmada expira en 60 segundos
    });
};

// Ruta para obtener el archivo 'mostrar_informe.pdf'
app.get('/obtener-archivo', async (req, res) => {
    const { bucket, file } = req.query;

    if (!bucket || !file) {
        return res.status(400).send('Es necesario especificar el nombre del bucker y del archivo');
    }
    const fileType = path.extname(file); 

    try {
        // Realiza la solicitud preflight CORS con los parámetros proporcionados
        await checkCors(bucket, file);

        // Obtener la URL prefirmada con los parámetros proporcionados
        const signedUrl = await getSignedUrl(bucket, file);

        const response = await axios.get(signedUrl, {
            headers: {
                'Content-Type': 'application/pdf'
            },
            responseType: 'arraybuffer'
        });

        const contentTypeMap = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.jpg': ' image/jpg',
            '.png':'image/png'
        };
        const contentType = contentTypeMap[fileType] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.send(response.data);
        console.log(req.query.file)//archivo que le estoy proporcionando a signedUrl
    } catch (error) {
        console.error('Error  al obtener el archivo:', error.message);
        res.status(500).send('Error al obtener el archivo');
    }
});
const puerto = 3001;

app.listen(3001, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${puerto}`);
});