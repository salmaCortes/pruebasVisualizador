import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function Prueba18() {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [documentNormal, setDocumentNormal] = useState(null);
  const [fileName, setFileName] = useState(""); 
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [excelDocumento, setExcelDocumento] = useState([]);

  useEffect(() => {
    const fetchDocument = async () => {
      const extension = fileName.split('.').pop().toLowerCase();

      if (['doc', 'docx', 'ppt', 'pptx'].includes(extension)) {
        try {
          const response = await fetch(`http://localhost:3001/convert?fileName=${fileName}`);
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setDocumentUrl(url);
          } else {
            console.error('Error fetching converted document');
          }
        } catch (error) {
          console.error('Error fetching converted document:', error);
        }
      } else if (['csv', 'xls', 'xlsx'].includes(extension)) {
        try {
          const response = await fetch(`http://localhost:8081/${fileName}`);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const wb = XLSX.read(data, { type: 'array' });
            setSheetNames(wb.SheetNames);
            const firstSheetName = wb.SheetNames[0];
            setSelectedSheet(firstSheetName);
            const worksheet = wb.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setExcelDocumento(jsonData);
          } else {
            console.error('Error fetching Excel document');
          }
        } catch (error) {
          console.error('Error fetching Excel document:', error);
        }
      } else {
        const url = `http://localhost:8081/${fileName}`;
        setDocumentNormal(url);
      }
    };

    if (fileName) {
      fetchDocument();
    }

    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [fileName]);

  const handleClearFileName = () => {
    setFileName("");
    setDocumentUrl(null);
    setDocumentNormal(null);
    setSheetNames([]);
    setExcelDocumento([]);
  };

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
  };

  return (
    <div>
      <h1>Prueba Docs</h1>
        <div className="container-fluid">
                
          <div className="col-9 d-flex align-items-center">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Ingrese el nombre del archivo"
            />
            <button onClick={handleClearFileName}>Borrar nombre del archivo</button>
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

      {excelDocumento.length > 0 && (
        <div className="viewer">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelDocumento[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelDocumento.map((row, index) => (
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
      )}

      {(documentUrl || documentNormal) && (
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={[
            {
              uri: documentUrl || documentNormal,
              fileName: fileName
            },
          ]}
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
