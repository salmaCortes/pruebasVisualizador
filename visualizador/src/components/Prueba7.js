import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

export default function Prueba7() {
    const bucket = 'holis';
    const file = 'prueba1.docx'; 
    const [fileUrl, setFileUrl] = useState(null);

    useEffect(() => {
        // Configura el cliente S3
        const s3 = new AWS.S3({
            accessKeyId: '24XG5L9P2ZNBRLBEUYOS',
            secretAccessKey: 'XS8OIvTyXlZk18NBDniayFpQkb6JwDZuWAoOr3DF',
            endpoint: 'https://s3.us-central-1.wasabisys.com',
            region: 'us-central-1'
        });

        // Genera la URL directa
        const getDirectUrl = () => {
            const params = {
                Bucket: bucket,
                Key: file
            };

            // Obtén la URL directa
            const url = s3.getSignedUrl('getObject', params);
            setFileUrl(url);
        };

        getDirectUrl();
    }, [bucket, file]);

    return (
        <div>
            <h1>Prueba Docs</h1>
            {fileUrl && (
                <iframe
                    src={fileUrl}
                    width="1366px"
                    height="623px"
                    frameBorder="0"
                >
                    This is an embedded 
                    <a target="_blank" href="http://office.com">
                        Microsoft Office
                    </a> 
                    document, powered by 
                    <a target="_blank" href="http://office.com/webapps">
                        Office Online
                    </a>.
                </iframe>
            )}
        </div>
    );
}
