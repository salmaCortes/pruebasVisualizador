import React, { useState } from 'react';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export default function Prueba4() {
  const [fileUrl, setFileUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const convertFileFromUrl = async () => {
    if (!fileUrl) {
      alert("Por favor, ingresa una URL de archivo válida.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:2000/convert',
        { url: fileUrl },
        { responseType: 'blob' }
      );

      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error converting file:', error);
    }
  };

  const documentos = pdfUrl ? [{ uri: pdfUrl }] : [];

  return (
    <div>
      <h1>Prueba Docs</h1>
      <input
        type="text"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
        placeholder="Ingresa la URL del archivo"
        style={{ width: "400px", marginRight: "10px" }}
      />
      <button onClick={convertFileFromUrl}>
        Convertir y mostrar archivo
      </button>

      {pdfUrl && (
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={documentos}
          style={{ height: 1000, marginTop: "20px" }}
        />
      )}
    </div>
  );
}
