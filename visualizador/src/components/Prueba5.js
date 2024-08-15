import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import React from 'react';

export default function Prueba2() {
    // Puedes cambiar la URL según el tipo de archivo que quieras visualizar
    const nombreDoc ="deathnote.jpg";
    const documentUrl = `https://s3.us-central-1.wasabisys.com/front/${nombreDoc}`;

    return (
        <div>
            <h1>Prueba Docs</h1>
            <DocViewer
                pluginRenderers={DocViewerRenderers}
                documents={[
                    {
                        uri: `http://localhost:3001/get-file?url=${documentUrl}`,  
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
