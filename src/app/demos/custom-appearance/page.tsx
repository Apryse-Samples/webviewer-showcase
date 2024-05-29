"use client";

import Demo from "@/lib/components/shared/Demo";
import { files } from "@/lib/config/files";
import useUpdateEffect from "@/lib/hooks/useUpdateEffect";
import { useWebViewer} from "@/lib/hooks/useWebViewer";
import { useAppSelector } from "@/lib/store/hooks";
import { Box, Button, Divider, HStack, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { Core } from "@pdftron/webviewer";
import { useEffect, useRef, useState } from "react";
import "jsoneditor/dist/jsoneditor.css";
import JSONEditorComponent from "@/lib/components/shared/JSONEditor";
import Preview from "@/lib/components/shared/WebViewerPreview";

export default function Home() {

  const { instance, loadDocument, document } = useWebViewer();


  useEffect(() => {
    if(!instance?.Core) return;

    const { annotationManager } = instance.Core;

    annotationManager.addEventListener('annotationChanged', (annotations, action) => {
      console.log(action)
      if (action === 'add') {
        console.log('this is a change that added annotations');
      } else if (action === 'modify') {
        console.log('this change modified annotations');
      } else if (action === 'delete') {
        console.log('there were annotations deleted');
      }
    
    });

    loadDocument(files.TEMPLATE.path);
  },[instance])


  return (
    <Demo 
      title={"Document Generation"} 
      description={"Securely merge JSON data with MS Word, PowerPoint and Excel templates directly in the browser - no server required! Easily generate documents using text/image templates with JavaScript."}>
      <VStack w={"100%"} spacing={'5'}>

      </VStack>
    </Demo>
  );
}
