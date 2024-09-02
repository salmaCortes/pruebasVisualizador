import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import * as XLSX from 'xlsx';
import axios from 'axios';
import AWS from 'aws-sdk';

export default function Prueba19() {
    const bucket = 'holis';
    const [file, setFile] = useState(""); 
    const [fileUrl, setFileUrl] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [workbook, setWorkbook] = useState(null);

    
    useEffect(() => {
        if (!file) {
            return;
        }
        
        const checkCors = async (bucket, file) => {
            try {
                const url = `https://s3.us-central-1.wasabisys.com/${bucket}/${file}`;
                await axios.options(url, {
                    headers: {
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
    
        const fetchFile = async () => {
            const s3 = new AWS.S3({
                accessKeyId: '0G253P3JA7TF0VQBN4S6',
                secretAccessKey: 'JAEetIqmc6FCuc6Ovzkn4affEyUlO8Z5abuFin2c',
                endpoint: 'https://s3.us-central-1.wasabisys.com',
                region: 'us-central-1'
            });
    
            const getDirectUrl = () => {
                const params = { Bucket: bucket, Key: file };
                return s3.getSignedUrlPromise('getObject', params);
            };
            
            const contentTypeMap = {
                pdf: 'application/pdf',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ppt: 'application/vnd.ms-powerpoint',
                pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                xls: 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                txt: 'text/plain',
                jpg: 'image/jpg',
                png: 'image/png'
            };
    
            try {
                await checkCors(bucket, file);
                const signedUrl = await getDirectUrl();
                console.log('URL doc firmado:', signedUrl);
                
                const fileExtension = file.split('.').pop().toLowerCase();
    
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
                    setFileUrl(signedUrl);
                } else if (['jpg', 'png', 'txt', 'pdf'].includes(fileExtension)) {
                    const response = await axios.get(signedUrl, {
                        headers: { 'Content-Type': contentTypeMap[fileExtension] || 'application/octet-stream' },
                        //responseType: 'arraybuffer'
                        responseType: 'arraybuffer'
                    });
                    //const blob = new Blob([response.data], { type: contentTypeMap[fileExtension] || 'application/octet-stream' });
                    //const url = window.URL.createObjectURL(blob);
                    const blob = new Blob([response.data], { type: contentTypeMap[fileExtension] || 'application/octet-stream' });
                    const url = window.URL.createObjectURL(blob);
                   
                    setFileUrl(url)
                    //setFileUrl(response.data);
                } else {
                    console.warn(`Tipo de archivo no soportado: ${fileExtension}`);
                }
            } catch (error) {
                console.error('Error al obtener el archivo:', error.message);
            }
        };
    
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

    const handleClearFile = () => {
        setFile("");
        setFileUrl(null);
        setSheetNames([]);
        setExcelData([]);
    };

    return (
        <div>
           
            <h1>Prueba Docs</h1>
            <div className="container-fluid">
                
                <div className="col-9 d-flex align-items-center">
                    
                    <input
                        type="text"
                        className="form-control"
                        value={file}
                        onChange={(e) => setFile(e.target.value)}
                        placeholder="Ingrese el nombre del archivo"
                    />
                    <button onClick={handleClearFile} className="btn btn-danger ms-2">
                        Borrar  
                    </button>
                </div>
            </div>



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
                    documents={[{ 
                        uri: fileUrl,
                        fileName: file

                    }]}
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
    );
}
