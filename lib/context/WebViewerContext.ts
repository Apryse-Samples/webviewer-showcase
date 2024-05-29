"use client";

import { createContext } from "react";
import { WebViewerInstance } from "@pdftron/webviewer";

export interface IWebViewerContext {
    instance: WebViewerInstance;
    setInstance?: (instance: WebViewerInstance) => void;
}

const WebViewerContext = createContext<IWebViewerContext>({} as IWebViewerContext);

export { WebViewerContext };