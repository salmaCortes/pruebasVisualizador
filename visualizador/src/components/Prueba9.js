import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import axios from 'axios';
import * as docx from 'docx';

// Componente para visualizar el documento DOCX convertido a HTML
const DocViewer = ({ fileUrl }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    axios.get(fileUrl, { responseType: 'arraybuffer' })
      .then(response => {
        mammoth.convertToHtml({ arrayBuffer: response.data })
          .then(result => {
            setHtmlContent(result.value);
          })
          .catch(err => console.error('Error converting to HTML:', err));
      })
      .catch(error => console.error('Error fetching file:', error));
  }, [fileUrl]);

  return (
    <div>
      <h1>Document Viewer</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

// Componente para crear un nuevo documento DOCX
const CreateDocument = () => {
  const generateDocx = () => {
    const doc = new docx.Document({
      sections: [
        {
          properties: {},
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun("Hello world!"),
                new docx.TextRun({
                  text: "This is bold.",
                  bold: true,
                }),
                new docx.TextRun({
                  text: "This is italic.",
                  italics: true,
                }),
                new docx.TextRun({
                  text: "This is underlined.",
                  underline: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    docx.Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url); // Abre el documento en una nueva pestaña o ventana
    });
  };

  return (
    <div>
      <h1>Create Document</h1>
      <button onClick={generateDocx}>Generate DOCX</button>
    </div>
  );
};

// Componente principal
export default function Prueba9() {
  const fileUrl = "http://localhost:8000/files/prueba1.docx";

  return (
    <div>
      <DocViewer fileUrl={fileUrl} />
      <CreateDocument />
    </div>
  );
}
