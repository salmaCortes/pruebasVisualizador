import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import React from 'react'

export default function Prueba14() {

  return (
    <div>
      <h1>Prueba Docs</h1>
      <DocViewer
   
        pluginRenderers={DocViewerRenderers}
        
        documents={
            [
                {
                  uri: "http://200.94.83.146:3715/Introducción a Electron.pptx"

                   
                
            
                }
    
            ]
        }
   

        style={{height:800}}
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
