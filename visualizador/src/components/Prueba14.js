import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import React, { useEffect, useState } from 'react';

export default function Prueba14() {
  const [fileName, setFileName] = useState(""); 
  const [documentNormal, setDocumentNormal] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const url = `http://192.168.1.87:8081/${fileName}`;
        setDocumentNormal(url);
      } catch (error) {
        console.error("Error al obtener el documento:", error);
      }
    };

    if (fileName) {
      fetchDocument();
    }
  }, [fileName]);

  const handleClearFileName = () => {
    setFileName("");
    setDocumentNormal(""); 
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
      {documentNormal && (
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={[
            {
              uri: documentNormal,
              fileName: fileName,
            },
          ]}
          style={{ height: '800px', width: '100%' }} // Ajusta el ancho para que ocupe el 100% del contenedor
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
