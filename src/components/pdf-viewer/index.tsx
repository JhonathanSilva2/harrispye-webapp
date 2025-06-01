"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

type PDFViewerProps = {
    fileUrl: string;
};

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="h-[80dvh] w-full">
            <Worker workerUrl={`/vendor/pdf.worker.min.js`}>
                <Viewer
                    theme={"dark"}
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
}
