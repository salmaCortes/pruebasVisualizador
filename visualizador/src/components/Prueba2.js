import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import React from 'react'
//Código 2 para poner a prueba la librería "@cyntler/react-doc-viewer"

export default function Prueba1() {

  return (
    <div>
      <h1>Prueba Docs</h1>
      <DocViewer
   
        pluginRenderers={DocViewerRenderers}
        
        documents={
            [
                //prueba 1 pdf
                {
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/Tesis_Alma.pdf",
                    fileType: "pdf"
                    

                },
                
            
                //prueba 2 pdf
                {
                    uri: require("../media/Tesis_Alma.pdf"),
                    fileType: "pdf"
                    
            
                },
            


                //prueba 2 docx - word  //funciona con  archivo en la nube
            
                {
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/prueba1.docx",
                    fileType: "docx"
                
            
                },


                //prueba 1 archivos txt guardados de forma local
                //si sirve con archivos txt guardados de forma local

                {
                    uri: require("../media/hola.txt"),
                    fileType: "txt"
                },

            
                //prueba 2 archivos txt guardados de forma local
                //si funciona con archivos txt guardados en la nube
                {
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/hola.txt",
                    fileType: "txt"
                

                },


                {
                    //si funciona con una url en la nube
                    //prueba 2 documento de powerpoint
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/AC.pptx",
                    fileType: "pptx"
                

                },


                //prueba 2 archivo de excel
                //si funciona con archivos en la nube
                {
                    uri:"https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/dataset_sectorTerciario.xlsx",
                    fileType: "xlsx"

                },
    
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
