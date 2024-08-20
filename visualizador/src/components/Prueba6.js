import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import * as XLSX from 'xlsx';
import axios from 'axios';
import AWS from 'aws-sdk';

export default function Prueba6() {
    const bucket = 'holis';
    const file = 'k.png'; 
    const [fileUrl, setFileUrl] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [workbook, setWorkbook] = useState(null);

    useEffect(() => {
       
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

        const obtenerArchivo = async (bucket, file) => {
            const fileType = file.split('.').pop().toLowerCase();
            try {
                const signedUrl = await getSignedUrl(bucket, file);
                const fileExtension = file.split('.').pop().toLowerCase();

                const contentTypeMap = {
                    doc: 'application/msword',
                    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ppt: 'application/vnd.ms-powerpoint',
                    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    xls: 'application/vnd.ms-excel',
                    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    txt: 'text/plain',
                    jpg: 'image/jpg',
                    png: 'image/png',
                };

                const contentType = contentTypeMap[fileType] || 'application/octet-stream';

                // Mapea los tipos de archivos y su manejo
                if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
                    const response = await axios.get(signedUrl, { responseType: 'arraybuffer' });
                    const data = new Uint8Array(response.data);
                    const wb = XLSX.read(data, { type: 'array' });
                    setWorkbook(wb);
                    setSheetNames(wb.SheetNames);
                    const firstSheetName = wb.SheetNames[0];
                    setSelectedSheet(firstSheetName);
                    const worksheet = wb.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    setExcelData(jsonData);
                } else if (['doc', 'docx', 'ppt', 'pptx', 'odt'].includes(fileExtension)) {
                    const pdfResponse = await axios.post('http://localhost:8000/convertir', {
                        fileUrl: signedUrl,
                        fileExtension: fileExtension
                    });
                    setFileUrl(pdfResponse.data.pdfUrl);

                } else if (['jpg', 'png', 'txt'].includes(fileType)) {
                    const response = await axios.get(signedUrl, {
                        headers: { 'Content-Type': contentType },
                        responseType: 'arraybuffer'
                    });
                    const blob = new Blob([response.data], { type: contentType });
                    const url = window.URL.createObjectURL(blob);
                    setFileUrl(url);
                } else {
                    // Manejo para tipos de archivos no especificados
                    console.warn(`Tipo de archivo no soportado: ${fileExtension}`);
                }
            } catch (error) {
                console.error('Error al obtener el archivo:', error.message);
            }
        };

        obtenerArchivo(bucket, file);
    }, [bucket, file]);

    const handleSheetChange = (sheetName) => {
        if (workbook) {
            setSelectedSheet(sheetName);
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(jsonData);
        }
    };

    return (
        <div className="wrapper">
            <h1>Prueba Docs</h1>

            {sheetNames.length > 0 && (
                <div className="sheet-selector">
                    <label htmlFor="sheet-select">Seleccionar Hoja:</label>
                    <select
                        id="sheet-select"
                        value={selectedSheet}
                        onChange={(e) => handleSheetChange(e.target.value)}
                    >
                        {sheetNames.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="viewer">
                {excelData.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    {Object.keys(excelData[0] || {}).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.keys(row).map((key) => (
                                            <td key={key}>{row[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : fileUrl && (
                    <DocViewer
                        pluginRenderers={DocViewerRenderers}
                        documents={[{ uri: fileUrl }]}
                        style={{ height: 800 }}
                        theme={{
                            primary: "#5296d8",
                            secondary: "#ffffff",
                            tertiary: "#5296d899",
                            text_primary: "#ffffff",
                            text_secondary: "#5296d8",
                            text_tertiary: "#00000099",
                            disableThemeScrollbar: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
