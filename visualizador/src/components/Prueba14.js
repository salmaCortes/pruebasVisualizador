import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import React, { useEffect, useState } from 'react';

export default function Prueba14() {
  
  const [fileName, setFileName] = useState(""); 
  const [documentNormal, setDocumentNormal] = useState(null);
 
  useEffect(() => {
    const fetchDocument = async () => {
      const url = `http://192.168.1.87:8081/${fileName}`;
      setDocumentNormal(url);
      
    };

    if (fileName) {
      fetchDocument();
    }

   
  }, [fileName]);

  const handleClearFileName = () => {
    setFileName("");
    
  };

 

  return (
    <div>
      <h1>Prueba Docs</h1>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Ingrese el nombre del archivo"
      />
      <button onClick={handleClearFileName}>Borrar nombre del archivo</button>

      

      
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={[
            {
              uri:documentNormal ,
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
     
    </div>
  );
}
