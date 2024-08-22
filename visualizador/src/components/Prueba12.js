import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export default function Prueba12() {
  
  const fileName = "Notas Curso Big Data y Spark.docx";
  const baseUrl = "http://200.94.83.146:3715/";

  const url = `${baseUrl}${fileName}`;

  const [archiOffice, setarchiOffice] = useState(false);

  useEffect(() => {

    // Función para obtener la extensión del archivo
    const getFileExtension = (url) => {
      const parts = url.split('.');
      return parts[parts.length - 1].toLowerCase();
    };

    // Obtiene la extensión del archivo de la URL
    const extension = getFileExtension(fileName);
    
  
    const extensionesArchiOffice = ["pptx", "xlsx", "docx", 'odt',"doc","xls","ppt"];

    if (extensionesArchiOffice.includes(extension)) {
      setarchiOffice(true);
    } else {
      setarchiOffice(false);
    }
  }, [fileName]);

  return (
    <div>
      <h1>Prueba Docs</h1>
      {archiOffice ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
          width="1366px"
          height="623px"
          frameBorder="0"
        ></iframe>
      ) : (
        <DocViewer
          documents={[{ uri: url }]}
          pluginRenderers={DocViewerRenderers}
        />
      )}
    </div>
  );
}
