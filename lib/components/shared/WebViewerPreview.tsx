"use client";

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Modal, HStack, Heading, Text, VStack, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex } from '@chakra-ui/react'
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';

/**
 * The shared preview component.
 */

export default function WebViewerPreview() {

    const webviewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        WebViewer({
            path: `/webviewer`,
            licenseKey: process.env.LICENSE_KEY,
            fullAPI: true,
            ui: "beta"
        },
        webviewerRef.current as any
        ).then((instance: WebViewerInstance) => { 
            if(previewFile){
                instance?.UI.loadDocument(previewFile, { extension: extension});
            }
        });
    }, [])

    return (
        <Flex p="2" flex={1} bg="gray.300" style={{ marginLeft: 0}}>
            <Box 
                border="1px solid"
                borderColor="gray.300"
                borderRadius='8px' 
                w='100vh' 
                h="calc(100vh - 250px)" 
                ref={webviewerRef}></Box>
        </Flex>
    )
}