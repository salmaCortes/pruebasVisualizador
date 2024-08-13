import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import React from 'react'

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
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/77235568d26a29d44d030a629097cca997d6ba6c/Tesis_Alma.pdf",
                    fileType: "pdf"
                    

                },
                
            
                //prueba 2 pdf
                {
                    uri: require("../media/Tesis_Alma.pdf"),
                    fileType: "pdf"
                    
            
                },
            


                //prueba 2 docx - word  //funciona con  archivo en la nube
            
                {
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/153122ba49c51837d92f5d90c69918c2003095e6/prueba1.docx",
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
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/5a8da181870251dbc2751b538af8e59680619106/hola.txt",
                    fileType: "txt"
                

                },


                {
                    //si funciona con una url en la nube
                    //prueba 2 documento de powerpoint
                    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/a4d0537dfca3cb5ff22bcd05aea7dd53bf369884/AC.pptx",
                    fileType: "pptx"
                

                },


                //prueba 2 archivo de excel
                //si funciona con archivos en la nube
                {
                    uri:"https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/a4d0537dfca3cb5ff22bcd05aea7dd53bf369884/dataset_sectorTerciario.xlsx",
                    fileType: "xlsx"

                },
    
            ]
        }
   

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
  );

}
