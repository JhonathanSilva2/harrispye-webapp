"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

type PDFViewerProps = {
    fileUrl: string;
};

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="h-[80vh] w-full">
            <Worker workerUrl={`/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
}
