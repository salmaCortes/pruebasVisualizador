import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import * as XLSX from 'xlsx';
import axios from 'axios';
import AWS from 'aws-sdk';

export default function Prueba6() {
    const bucket = 'holis';
    const file = 'mostrar_informe.pdf'; 
    const [fileUrl, setFileUrl] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [workbook, setWorkbook] = useState(null);

    

    useEffect(() => {
        const fetchFile = async () => {
            const fileType = file.split('.').pop().toLowerCase();
            console.log(`Fetching file type: ${fileType}`);
            
            
                const s3 = new AWS.S3({
                    accessKeyId: '24XG5L9P2ZNBRLBEUYOS',
                    secretAccessKey: 'XS8OIvTyXlZk18NBDniayFpQkb6JwDZuWAoOr3DF',
                    region: 'us-central-1',
                    signatureVersion: 'v4'
                });
    
                const checkCors = async (bucket, file) => {
                    try {
                        const url = `https://s3.us-central-1.wasabisys.com/${bucket}/${file}`;
                        await axios.options(url, {
                            headers: {
                                'Host': 's3.us-central-1.wasabisys.com',
                                'Origin': 'http://localhost:3000',
                                'Access-Control-Request-Method': 'GET',
                                'Access-Control-Request-Headers': 'Content-Type'
                            }
                        });
                        console.log('CORS preflight request fue exitoso');
                    } catch (error) {
                        console.error('Error en CORS preflight request:', error.message);
                    }
                };
    
                const getDirectUrl = () => {
                    const params = {
                        Bucket: bucket,
                        Key: file
                    };
                    return s3.getSignedUrlPromise('getObject', params);
                };
    
                try {
                    await checkCors(bucket, file);
                    const signedUrl = await getDirectUrl();
                    console.log(`Signed URL: ${signedUrl}`);
    
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
    
                    if (['xlsx', 'xls', 'csv'].includes(fileType)) {
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
                        console.log(`Excel data: ${JSON.stringify(jsonData)}`);
                    } else if (['doc', 'docx', 'ppt', 'pptx', 'odt'].includes(fileType)) {
                        const pdfResponse = await axios.post('http://localhost:3001/convertir', {
                            fileUrl: signedUrl,
                            fileExtension: fileType
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
                        console.warn(`Tipo de archivo no soportado: ${fileType}`);
                    }
                } catch (error) {
                    console.error('Error al obtener el archivo:', error.message);
                }
            }
        
    
        fetchFile();
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
        <div>
            <h1>Prueba Docs</h1>
    
            <div className="wrapper">
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
            </div>
    
            <div>
                {excelData.length > 0 ? (
                    <div className="viewer">
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
