import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import React from 'react'

//Código 1 para poner a prueba la librería "react-doc-viewer"
export default function Prueba4() {

    const documentos =[
    
   
        {
        uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/AC.pptx"
        
        },
        
    
    ];
  

  return (
    <div>
        <h1>Prueba Docs </h1>
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={documentos}
          style={{height:1000}}
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
  )
}
