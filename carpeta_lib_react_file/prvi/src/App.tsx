import {useRef,useEffect} from 'react';
import './App.css';
import WebViewer from '@pdftron/webviewer';

//Código  para poner a prueba la librería "pdftron/webviewer"

function App() {
  const viewerDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {    
    WebViewer({
      path: 'lib',
      //initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_about.pdf'
      initialDoc: "https://raw.githubusercontent.com/salmaCortes/pruebasVisualizador/master/dataset_sectorTerciario.xlsx"

    }, viewerDiv.current as HTMLDivElement).then(instance =>{
      

    });
  }, []);
  return (
    <div className="App">
      <div className='webviewer' ref={viewerDiv}></div>
      
    </div>
  );
}

export default App;
