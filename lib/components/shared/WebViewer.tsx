import React, { useEffect, useRef, useContext } from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { useAppDispatch } from '../../store/hooks';
import { WebViewerContext } from '../../context/WebViewerContext';
import { wvDocumentLoaded } from '../../store/slices/webviewerSlice';

const WebViewerWrap = () => {
    const dispatch = useAppDispatch();
    const webviewerRef = useRef<HTMLDivElement>(null);
    const { setInstance }  = useContext(WebViewerContext);

    useEffect(() => {
        WebViewer({
            path: `/webviewer`,
            licenseKey: process.env.LICENSE_KEY,
            fullAPI: true,
            ui: "beta"
        },
        webviewerRef.current as any
        ).then(async (instance: WebViewerInstance) => { 
          if(instance){
            const { documentViewer } = instance.Core;

            setInstance?.(instance);

            instance.Core.PDFNet.initialize();
    
            documentViewer.addEventListener('documentLoaded', () => {
              dispatch(wvDocumentLoaded(documentViewer.getDocument()));
            });
          }
        });
    }, []);

  return (
    <Flex p="2" flex={1} bg="gray.300" style={{ marginLeft: 0}}>
        <Box 
          border="1px solid"
          borderColor="gray.300"
          borderRadius='8px' 
          w='100%' 
          h="calc(100vh - 72px)" 
          ref={webviewerRef}></Box>
    </Flex>
  );
};

export default WebViewerWrap;