'use client';

import { WebViewerContext } from '@/lib/context/WebViewerContext';
import { WebViewerInstance } from '@pdftron/webviewer';
import { useState } from 'react';

export const WebViewerProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [instance, setInstance] = useState<WebViewerInstance>({} as WebViewerInstance);
    
    return (
    <WebViewerContext.Provider value={{ instance, setInstance }}>
        {children}
    </WebViewerContext.Provider>
     )
}