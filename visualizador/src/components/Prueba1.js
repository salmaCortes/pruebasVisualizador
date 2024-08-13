import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { useState } from "react";

import React from 'react'

export default function Prueba1() {

  const documentos =[
    /*
    //prueba 1 docx - word 
    //si funciona de forma de archivo en la nube
    {
      uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/153122ba49c51837d92f5d90c69918c2003095e6/prueba1.docx",
     
      fileName:"doc1.docx"
      
    },//archivo en la nube
    */
    /*
    //no funciona con from "react-doc-viewer";
    {
      uri: require("../media/Tesis_Alma.pdf"),
      fileType:"pdf"
      

    },
    */
   /* 
   //Este si se puede con @cyntler/react-doc-viewer
   //prueba 1 pdf
    {
      uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/77235568d26a29d44d030a629097cca997d6ba6c/Tesis_Alma.pdf",
      fileType: "pdf"
     
  
    },
    
    */
   /*
   //Así también funciona con "@cyntler/react-doc-viewer";
   //prueba 2 pdf
    {
      uri: require("../media/Tesis_Alma.pdf"),
      fileType: "pdf"
     
  
    },
    */
   /*
   //Este le intenté con "@cyntler/react-doc-viewer"; y no funcionó
    {
      uri: require("../media/prueba1.docx"),
      fileType: "docx"
     
  
    },
    */
   //este si funciona con "@cyntler/react-doc-viewer"
    //prueba 2 docx - word  //funciona con  archivo en la nube
   /*
    {
      uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/153122ba49c51837d92f5d90c69918c2003095e6/prueba1.docx",
      fileType: "docx"
     
  
    },
    */
   //Prueba de "@cyntler/react-doc-viewer" con documentos txt
   //prueba 1 archivos txt guardados de forma local
   //si sirve con archivos txt guardados de forma local
   /*
   {
    uri: require("../media/hola.txt"),
    fileType: "txt"
   

  },
  */
 /*
 //prueba 2 archivos txt guardados de forma local
 //si funciona con archivos txt guardados en la nube
  {
    uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/5a8da181870251dbc2751b538af8e59680619106/hola.txt",
    fileType: "txt"
   

  },
*/
/*
//prueba 1 documento de powerpoint
//no funcionó el visualizar el archivo pptx de esta forma
{
  uri: require("../media/AC.pptx"),
  fileType: "pptx"
 

},
*/

{
  //si funciona con una url en la nube
  //prueba 2 documento de powerpoint
  uri: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/a4d0537dfca3cb5ff22bcd05aea7dd53bf369884/AC.pptx",
  fileType: "pptx"
 

},

/*
//prueba 1 archivo de excel
//no funciona con  archivos locales
{
  uri: require("../media/dataset_sectorTerciario.xlsx"),
  fileType: "xlsx"
 

},
*/

//prueba 2 archivo de excel
//si funciona con archivos en la nube
{
  uri:"https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/a4d0537dfca3cb5ff22bcd05aea7dd53bf369884/dataset_sectorTerciario.xlsx",
  fileType: "xlsx"

},
    
  ];
  const [activeDocument, setActiveDocument] = useState(documentos[0]);
  const handleDocumentChange = (document) => {
    setActiveDocument(document);
  };


  return (
    <div>
        <h1>Prueba Docs </h1>
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={documentos}
          activeDocument={activeDocument}
          onDocumentChange={handleDocumentChange}
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
