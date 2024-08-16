import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import React from 'react';

export default function Prueba2() {
    const bucket = 'holis';
    const file = 'k.png';
   

    return (
        <div>
            <h1>Prueba Docs</h1>
            <DocViewer
                pluginRenderers={DocViewerRenderers}
                documents={[
                    {
                        uri: `http://localhost:3001/obtener-archivo?bucket=${bucket}&file=${file}`,  
                    }
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
