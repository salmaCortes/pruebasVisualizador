import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';


//Código para poner a prueba la librería "react-file-viewer"
//const file = '../media/prueba1.docx';
const file  = "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/dataset_sectorTerciario.xlsx";
const type = 'xlsx';

export default class Prueba3 extends Component {
  render() {
    return (
    
        <FileViewer
          fileType={type}
          filePath={file}
         
        />
   
    );
  }

 
}
