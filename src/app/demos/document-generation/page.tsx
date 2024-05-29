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

  const webviewerState = useAppSelector((state) => state?.webviewer);
  const { instance, loadDocument, document } = useWebViewer();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editModeEnabled, setEditModeEnabled] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<Blob>();

  const [json, setJson] = useState<{}>({
    logo: {
      'image_url': '../../files/logo_red.png',
      'width': '64',
      'height': '64'
    },
    date: '07/16/21',
    dest: {
      address: '187 Duizelstraat\n5043 EC Tilburg, Netherlands',
      given_name: 'Janice N.',
      surname: 'Symonds',
      title: 'Ms.'
    },
    sender: {
      name: 'Arnold Smith'
    },
    land_location: '225 Parc St., Rochelle, QC ',
    client: {
      full_name: 'Mrs. Eric Tragar',
      gender_possesive: 'her'
    },
    lease_problem: 'According to the city records, the lease was initiated in September 2010 and never terminated',
  });


  const parseKeys = (keys: any[], previousJson: any) => {
    const sortedKeys = keys.sort((a,b) => a["1"].docOrder -  b["1"].docOrder);
    const tempJson = {};


    for (let i = 0; i < sortedKeys.length; i++) {
      var key = `${sortedKeys[i][0]}`;

      if(sortedKeys[i][1].properties){
        tempJson[`${key}`] = (parseKeys(Object.entries(sortedKeys[i][1].properties)), previousJson[key]);

      }else{
        if(previousJson){
          tempJson[`${key}`] = previousJson[key] 
        }else{
          tempJson[`${key}`] = ""
        }
      }
    }
    return tempJson;
  }

  const grabDocumentKeys = async () => {
    if(!document) return;

    const templateSchema = await document.getTemplateKeys("schema") as Core.TemplateSchema;
    
    const keys = Object.entries(templateSchema.keys) as any[];
    const sortedKeys = keys.sort((a,b) => a["1"].docOrder -  b["1"].docOrder );

    //Add new keys
    const tempJson = parseKeys(sortedKeys, json);
    setJson(tempJson)
  }

  useEffect(() => {
    if(!instance?.Core) return;

    loadDocument(files.TEMPLATE.path);
  },[instance])

  useUpdateEffect(() => {
    if(!webviewerState.document || editModeEnabled) {
      return;
    }

      grabDocumentKeys();
  },[webviewerState.document])

  const switchMode = async () => {
    const documentType = document?.getType();

    const docData = await document?.getFileData({
      downloadType: documentType
    });

    if(docData){
      loadDocument(new Blob([docData]), { extension:"docx", enableOfficeEditing: !editModeEnabled })
      setEditModeEnabled(!editModeEnabled)
    }
  }

  const preview = async () => {
    const documentType = document?.getType();

    const docData = await document?.getFileData({
      downloadType: documentType
    });


    if(docData){
      const arr = new Uint8Array(docData);
      const blob = new Blob([arr], { type: 'application/docx' });
      const url = URL.createObjectURL(blob);
      window.open(url);
      setPreviewFile(blob)
      onOpen();
    }
  }

  return (
    <Demo 
      title={"Document Generation"} 
      description={"Securely merge JSON data with MS Word, PowerPoint and Excel templates directly in the browser - no server required! Easily generate documents using text/image templates with JavaScript."}>
      <VStack w={"100%"} spacing={'5'}>
        <HStack w={"100%"} spacing={'5'}>
          <Button w="100%" colorScheme={"blue"} isDisabled={editModeEnabled} onClick={switchMode}>Edit DOCX</Button>
          <Button w="100%" colorScheme={"blue"} isDisabled={!editModeEnabled} onClick={switchMode}>Edit JSON</Button>
        </HStack>     
        <JSONEditorComponent jsonData={json} enabled={!editModeEnabled}/>
          <HStack w={"100%"} spacing={'5'}>
            <Button w="100%" colorScheme={"green"} onClick={preview}>Preview</Button>
            <Button w="100%" colorScheme={"red"}>Reset</Button>
          </HStack>
      </VStack>
    </Demo>
  );
}
