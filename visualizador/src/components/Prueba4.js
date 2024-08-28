
import React from 'react';


export default function Prueba4() {
  

  return (
    <div>
      <h1>Prueba Docs</h1>
      {/*iframe de drive */}
        <iframe
          sandbox='allow-scripts allow-same-origin'
        
          src={`https://docs.google.com/viewer?url=http://200.94.83.146:3715/Introducción a Electron.pptx&embedded=true`}
          width="1366px"
          height="1000px"
          frameBorder="0"
          ></iframe>
     
    </div>
  );
}
